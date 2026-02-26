<template>
  <div>
    <button class="my-3 btn btn-secondary w-100" @click="$router.back()">Powrót do listy</button>
    <section v-if="sessionInfo">
      <h1>{{ sessionInfo.courseName }}</h1>
      <p>Grupa: {{ sessionInfo.courseGroupName }}</p>
      <p>Termin: {{ sessionInfo.dateStart?.toLocaleString("pl-PL") }}</p>
      <p>Sala: {{ sessionInfo.locationName }}</p>
    </section>

    <hr />

    <section>
      <h2 class="text-center">Lista obecności</h2>
      <!-- <button class="btn btn-primary m-1 mb-2" @click="goToScanner">
          Uruchom skanowanie (QR)
        </button> -->
      <button class="btn btn-primary my-3 w-100" @click="fetchAttendance" :disabled="loading">
        Odśwież listę
      </button>

      <div v-if="loading">Ładowanie listy studentów...</div>

      <table class="table table-striped" v-else border="1">
        <thead>
          <tr>
            <th scope="col">Imię i Nazwisko</th>
            <th scope="col">Nr indeksu</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="student in attendanceList" :key="student.attenderUserId">
            <td>{{ student.userName }} {{ student.userSurname }}</td>
            <td>{{ student.attenderUserId }}</td>
            <td>
              <span v-if="student.wasUserPresent" class="badge bg-success">Obecny</span>
              <span v-else class="badge bg-danger">Nieobecny</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { Backend } from "@/main";
import type {
  CourseSessionAttendanceRecord,
  CourseSessionListItem,
} from "@/backend/AttendMeBackendClientBase";

const route = useRoute();
const sessionId = route.params.id as string;

const sessionInfo = ref<CourseSessionListItem | null>(null);
const attendanceList = ref<CourseSessionAttendanceRecord[]>([]);
const loading = ref(true);
let refreshInterval: number | null = null;

const fetchSessionInfo = async () => {
  try {
    const data = await Backend.courseTeacherSessionGet(Number(sessionId));
    sessionInfo.value = data;
  } catch (err) {
    console.error("Błąd pobierania szczegółów sesji", err);
  }
};

// 2. Pobieranie listy obecności
const fetchAttendance = async () => {
  try {
    // Metoda w dokumentacji
    const data = await Backend.courseSessionAttendanceListGet(Number(sessionId));
    attendanceList.value = data;
  } catch (err) {
    console.error("Błąd pobierania listy obecności", err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchSessionInfo();
  await fetchAttendance();

  refreshInterval = setInterval(fetchAttendance, 5000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});
</script>
