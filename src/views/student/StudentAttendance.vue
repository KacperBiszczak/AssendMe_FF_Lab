<template>
  <div>
    <button @click="$router.back()">Wróć do listy</button>

    <section v-if="sessionInfo">
      <h1>{{ sessionInfo.courseName }}</h1>
      <p><strong>Grupa:</strong> {{ sessionInfo.courseGroupName }}</p>
      <p><strong>Data:</strong> {{ formatDate(sessionInfo.dateStart) }}</p>
      <p><strong>Sala:</strong> {{ sessionInfo.locationName || "Brak danych" }}</p>

      <div>
        <p>Status: {{ sessionInfo.attendanceStatus || "Nieobecny" }}</p>
      </div>
    </section>

    <hr />

    <section>
      <div v-if="ticketToken">
        <h3>Twój kod QR:</h3>
        <qrcode-vue :value="ticketToken" :size="250" level="H" />
        <p>Kod odświeża się co 2 sekundy</p>
      </div>

      <div v-if="loading && !ticketToken">Generowanie biletu...</div>

      <!-- <div v-if="attendanceMessage">
        <h2 style="color: green">{{ attendanceMessage }}</h2>
      </div> -->

      <p v-if="error" style="color: red">{{ error }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
// import QrcodeVue from "qrcode.vue";
import { Backend } from "@/main";

const route = useRoute();
const sessionId = route.params.id as string;

const sessionInfo = ref<any>(null);
const ticketToken = ref<string | undefined>("");
const expireDate = ref<Date>(new Date());
const loading = ref(true);
const error = ref("");
let intervalId: any = null;

// 1. Pobieranie sygnatury zajęć
const fetchSessionDetails = async () => {
  try {
    // Używamy ID z URL, żeby pobrać dane o konkretnych zajęciach
    const data = await Backend.courseStudentGroupSessionsGet(Number(17));

    // Szukamy konkretnych zajęć w grupie
    sessionInfo.value = data.find((s: any) => s.courseSessionId === Number(sessionId));
  } catch (err) {
    console.error("Błąd pobierania sygnatury", err);
  }
};

// 2. Pobieranie dynamicznego biletu (QR)
const fetchTicket = async () => {
  try {
    console.log("Pobieranie tokenu dla sesji ID:", sessionId);
    const result = await Backend.courseSessionAttendanceScannerTokenGet(Number(sessionId));
    console.log("Pobrany token:", result);
    ticketToken.value = result.token;
  } catch (err) {
    error.value = "Problem z połączeniem.";
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("pl-PL");
};

onMounted(async () => {
  await fetchSessionDetails(); // Najpierw pokazujemy co to za zajęcia
  fetchTicket(); // Potem startujemy z kodem QR
  // intervalId = setInterval(fetchTicket, 2000); // Odświeżanie co 2s
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
