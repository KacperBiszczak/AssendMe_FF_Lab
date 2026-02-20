<template>
  <div>
    <header>
      <span>AttendMe</span>
      <div>
        <span>Witaj, Student!</span>
        <button @click="logout">Wyloguj</button>
      </div>
    </header>

    <main>
      <section>
        <h2>Twoje dzisiejsze zajęcia</h2>
        <p>Zarejestruj swoją obecność, generując kod QR</p>
      </section>

      <div v-if="loading">
        <p>Pobieranie planu zajęć...</p>
      </div>

      <div v-else-if="error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="sessions.length === 0">
        <h3>Brak zajęć</h3>
        <p>Nie masz obecnie żadnych zaplanowanych zajęć.</p>
      </div>

      <div v-else>
        <div v-for="session in sessions" :key="session.id">
          <div>
            <h3>{{ session.courseName }}</h3>
            <span>Prowadzący: {{ session.teacherName }}</span>

            <div>Status: {{ session.attendanceStatus || "Oczekuje" }}</div>

            <ul>
              <li>Czas: {{ formatDate(session.startDate) }}</li>
              <li>Sala: {{ session.roomName || "Brak danych" }}</li>
            </ul>

            <button @click="goToAttendance(session.id)">Zgłoś obecność</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Backend } from "@/main";

const router = useRouter();
const sessions = ref([]);
const loading = ref(true);
const error = ref("");

const fetchSessions = async () => {
  try {
    loading.value = true;
    // Pobranie listy zajęć dla studenta
    const response = await Backend.courseStudentSessionsGet({
      pageNumber: 1,
      pageSize: 100,
    });
    sessions.value = response.items || [];
  } catch (err) {
    error.value = "Nie udało się pobrać listy zajęć.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("pl-PL");
};

const goToAttendance = (id) => {
  router.push(`/student/attendance/${id}`);
};

const logout = () => {
  sessionStorage.clear();
  router.push("/login");
};

onMounted(fetchSessions);
</script>
