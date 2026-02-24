<template>
  <div>
    <button @click="$router.back()">Powrót do listy</button>

    <section v-if="sessionInfo">
      <h1>{{ sessionInfo.courseName }}</h1>
      <p>Grupa: {{ sessionInfo.courseGroupName }}</p>
      <p>Termin: {{ formatDate(sessionInfo.dateStart) }}</p>
      <p>Sala: {{ sessionInfo.locationName }}</p>
    </section>

    <hr />

    <section>
      <h2 class="text-center">Lista obecności</h2>
      <menu>
        <button class="btn btn-primary m-1 mb-2" @click="goToScanner">
          Uruchom skanowanie (QR)
        </button>
        <button class="btn btn-primary m-1 mb-2" @click="fetchAttendance" :disabled="loading">
          Odśwież listę
        </button>
      </menu>

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
          <tr v-for="student in attendanceList" :key="student.studentId">
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
import { useRoute, useRouter } from "vue-router";
import { Backend } from "@/main";
import type {
  CourseSessionAttendanceRecord,
  CourseSessionListItem,
} from "@/backend/AttendMeBackendClientBase";

const route = useRoute();
const router = useRouter();
const sessionId = route.params.id as string;
console.log("ID sesji:", sessionId);

const sessionInfo = ref<CourseSessionListItem | null>(null);
const attendanceList = ref<CourseSessionAttendanceRecord[]>([]);
const loading = ref(true);
let refreshInterval: number | null = null;
// console.log(attendanceList);
// 1. Pobieranie danych o samej sesji (szczegóły)
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

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("pl-PL");
};

const goToScanner = () => {
  router.push(`/teacher/scan/${sessionId}`);
};

onMounted(async () => {
  await fetchSessionInfo();
  await fetchAttendance();

  // Opcjonalnie: dokumentacja sugeruje odświeżanie cykliczne w tle (obrazek 4)
  refreshInterval = setInterval(fetchAttendance, 5000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});
</script>
