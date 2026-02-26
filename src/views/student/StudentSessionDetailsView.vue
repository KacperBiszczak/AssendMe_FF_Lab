<template>
  <div class="container p-3">
    <button @click="$router.back()" class="btn btn-secondary mb-3 w-100">Wróć do listy</button>

    <section v-if="sessionInfo" class="card p-3 shadow-sm mb-1">
      <h1>{{ sessionInfo.courseName }}</h1>
      <p><strong>Grupa:</strong> {{ sessionInfo.courseGroupName }}</p>
      <p><strong>Sala:</strong> {{ sessionInfo.locationName || "Brak danych" }}</p>

      <div class="attendance-progress mt-2 p-3 border rounded bg-white">
        <label class="fw-bold mb-2 d-block">Twoja frekwencja na tym przedmiocie:</label>

        <div class="d-flex align-items-center gap-3">
          <progress
            :value="attendanceStats.attended"
            :max="attendanceStats.total"
            class="flex-grow-1"
            style="height: 20px"
          ></progress>

          <span class="fw-bold"> {{ attendanceStats.attended }}/{{ attendanceStats.total }} </span>
        </div>

        <label class="fw-bold mt-3 mb-1 d-block">Zaawansowanie zajęć na tym przedmiocie:</label>

        <div class="d-flex align-items-center gap-3">
          <progress
            :value="attendanceStats.ended"
            :max="attendanceStats.total"
            class="flex-grow-1"
            style="height: 20px"
          ></progress>

          <span class="fw-bold"> {{ attendanceStats.ended }}/{{ attendanceStats.total }} </span>
        </div>

        <!-- <p class="small text-muted mt-2">Procentowa obecność: {{ calculatePercentage() }}%</p> -->
      </div>

      <!-- <div class="mt-3 p-2 border rounded bg-light">
        <strong>Status tych konkretnych zajęć:</strong>
        <span :class="sessionInfo.attendanceStatus === 'Obecny' ? 'text-success' : 'text-danger'">
          {{ sessionInfo.attendanceStatus || "Brak informacji" }}
        </span>
      </div> -->
    </section>

    <div v-else-if="loading">Ładowanie danych...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Backend } from "@/main";

const route = useRoute();
const sessionId = Number(route.params.id);

const sessionInfo = ref<any>(null);
const loading = ref(true);

// Dane do paska postępu
const attendanceStats = reactive({
  attended: 0, // Ile razy student był
  total: 0, // Ile zajęć odbyło się do tej pory
  ended: 0, // Ile zajęć już się odbyło (niezależnie od obecności)
});

const fetchSessionDetails = async () => {
  try {
    loading.value = true;

    // Pobieramy sesje, aby wyciągnąć dane o obecnych zajęciach
    const data = await Backend.courseStudentSessionsGet({
      pageNumber: 1,
      pageSize: 100,
    });

    const found = data.items?.find((s: any) => s.courseSessionId === sessionId);
    const courseGroupId = found?.courseGroupId;

    // Pobi
    const groupSessions = await Backend.courseStudentGroupSessionsGet(courseGroupId);
    const completedSessions = groupSessions.filter((s: any) => s.dateEnd < new Date());

    // Pobieranie obecności przedmiotu dla danego studenta
    const attendanceData = await Backend.courseStudentAttendanceGet(courseGroupId);

    if (found) {
      sessionInfo.value = found;

      // OBLICZANIE STATYSTYK:
      // Filtrujemy wszystkie sesje tego samego przedmiotu (courseName)
      const courseSessions =
        data.items?.filter((s: any) => s.courseName === found.courseName) || [];

      // Liczymy ile zajęć już się odbyło (miały status Obecny lub Nieobecny)
      // i na ilu student był (status Obecny)
      attendanceStats.total = courseSessions.length;
      attendanceStats.attended = attendanceData.length;
      attendanceStats.ended = completedSessions.length;
    }
  } catch (err) {
    console.error("Błąd pobierania statystyk:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSessionDetails);
</script>

<style scoped>
progress {
  appearance: none;
  width: 100%;
}
progress::-webkit-progress-bar {
  background-color: #eee;
  border-radius: 10px;
}
progress::-webkit-progress-value {
  background-color: #0d6efd;
  border-radius: 10px;
}
</style>
