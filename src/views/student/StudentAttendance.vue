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
// import QrcodeVue from "qrcode.vue"; // Upewnij się, że biblioteka jest zainstalowana
import { Backend } from "@/main";

const route = useRoute();
const sessionId = route.params.id as string;

const sessionInfo = ref<any>(null);
const ticketToken = ref<string | undefined>("");
// const attendanceMessage = ref<string>("");
const loading = ref(true);
const error = ref("");
const intervalId: any = null;

/**
 * 1. Pobieranie sygnatury zajęć oraz informacji o obecności
 */
const fetchSessionDetails = async () => {
  try {
    // Używamy metody pobierającej zajęcia dla studenta
    const data = await Backend.courseStudentSessionsGet({
      pageNumber: 1,
      pageSize: 100,
    });

    // Znajdujemy sesję o konkretnym ID z URL
    sessionInfo.value = data.items?.find((s: any) => s.id === Number(sessionId));
  } catch (err) {
    console.error("Błąd pobierania sygnatury", err);
  }
};

/**
 * 2. Pobieranie dynamicznego biletu (QR)
 * Wymaga wcześniejszej rejestracji urządzenia
 */
const fetchTicket = async () => {
  try {
    // Metoda zwracająca token (ticket) do wyświetlenia jako QR
    const result = await Backend.userAttendanceTicketGet();
    console.log("Pobrany token:", result);
    ticketToken.value = result.token;

    // Jeśli backend zwróci informację o ostatnio zarejestrowanej obecności
    // if (result.lastAttendanceMessage) {
    //   attendanceMessage.value = result.lastAttendanceMessage;
    // }
  } catch (err) {
    // Jeśli urządzenie nie jest zarejestrowane, tutaj może wystąpić błąd autoryzacji
    error.value = "Problem z pobraniem kodu. Upewnij się, że urządzenie jest zarejestrowane.";
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("pl-PL");
};

onMounted(async () => {
  await fetchSessionDetails();
  await fetchTicket();

  // Kod QR musi być generowany cyklicznie co 2 sekundy
  // intervalId = setInterval(fetchTicket, 2000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
