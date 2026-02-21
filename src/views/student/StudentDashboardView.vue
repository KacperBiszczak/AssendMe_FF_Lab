<template>
  <div>
    <header>
      <span>AttendMe - Student</span>
      <button @click="logout">Wyloguj</button>
    </header>

    <main>
      <h2 class="mb-2">Twoje zajęcia:</h2>

      <SessionsList
        :sessions="sessions"
        :loading="loading"
        actionLabel="Zgłoś obecność"
        @action="handleAttendance"
      />

      <p v-if="error">{{ error }}</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Backend } from "@/main";
import SessionsList from "@/components/SessionsList.vue"; // Import komponentu

const router = useRouter();
const sessions = ref<any[]>([]);
const loading = ref(true);
const error = ref("");

const fetchSessions = async () => {
  try {
    loading.value = true;
    const response = await Backend.courseStudentSessionsGet({ pageNumber: 1, pageSize: 100 });
    sessions.value = response.items || [];
  } catch (err) {
    error.value = "Błąd pobierania danych.";
  } finally {
    loading.value = false;
  }
};

const handleAttendance = (id: number) => {
  router.push(`/student/attendance/${id}`);
};

const logout = () => {
  sessionStorage.clear();
  router.push("/login");
};

onMounted(fetchSessions);
</script>
