<template>
  <div>
    <header>
      <span>AttendMe - Wykładowca</span>
      <button @click="logout">Wyloguj</button>
    </header>

    <main>
      <h2>Zarządzanie zajęciami</h2>

      <SessionsList
        :sessions="sessions"
        :loading="loading"
        actionLabel="Otwórz listę obecności"
        @action="handleDetails"
      />

      <p v-if="error">{{ error }}</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Backend } from "@/main";
import SessionsList from "@/components/SessionsList.vue";

const router = useRouter();
const sessions = ref<any[]>([]);
const loading = ref(true);
const error = ref("");

const fetchSessions = async () => {
  try {
    loading.value = true;
    const response = await Backend.courseTeacherSessionsGet({ pageNumber: 1, pageSize: 100 });
    sessions.value = response.items || [];
  } catch (err) {
    error.value = "Błąd pobierania danych.";
  } finally {
    loading.value = false;
  }
};

const handleDetails = (id: number) => {
  console.log("Wybrano zajęcia o ID:", id);
  router.push(`/teacher/session/${id}`);
};

const logout = () => {
  sessionStorage.clear();
  router.push("/login");
};

onMounted(fetchSessions);
</script>
