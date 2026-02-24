<template>
  <div class="w-100">
    <header class="p-2 border-bottom d-flex justify-content-between align-items-center">
      <span>AttendMe - Student</span>
      <div class="buttons">
        <button @click="logout" class="btn btn-danger btn-sm">Wyloguj</button>
      </div>
    </header>

    <main class="p-3">
      <h2 class="mb-3">Twoje zajęcia</h2>

      <section class="filters-container mb-4 p-3 bg-light rounded shadow-sm">
        <div class="row g-3">
          <div class="col-md-12">
            <label class="form-label fw-bold">Wyszukaj (przedmiot, lokalizacja):</label>
            <input
              v-model="filters.searchText"
              type="text"
              class="form-control"
              placeholder="Np. Programowanie, Sala 101"
              @input="fetchSessions"
            />
          </div>

          <div class="col-md-12">
            <label class="form-label fw-bold d-block">Szybki wybór:</label>
            <div class="btn-group btn-group-sm w-100" role="group">
              <button
                v-for="preset in presets"
                :key="preset.id"
                class="btn btn-outline-primary"
                :class="{ active: activePreset === preset.id }"
                @click="setPreset(preset.id)"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Data od:</label>
            <input
              v-model="manualDates.from"
              type="date"
              class="form-control"
              @change="handleManualDateChange"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Data do:</label>
            <input
              v-model="manualDates.to"
              type="date"
              class="form-control"
              @change="handleManualDateChange"
            />
          </div>
        </div>
      </section>

      <SessionsList
        :sessions="sessions"
        :loading="loading"
        actionLabelDetails="Szczegóły"
        actionLabelAttendance="Zgłoś obecność"
        @actionLabelDetails="handleActionDetails"
        @actionLabelAttendance="handleAttendance"
        @actionLabelRegisterDevice="handleRegisterDevice"
      />

      <p v-if="error" class="text-danger mt-3">{{ error }}</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Backend } from "@/main";
import SessionsList from "@/components/SessionsList.vue";

const router = useRouter();
const sessions = ref<any[]>([]);
const loading = ref(true);
const error = ref("");
const activePreset = ref("all");

// Model dla ręcznego wyboru dat
const manualDates = reactive({
  from: "",
  to: "",
});

const filters = reactive({
  searchText: "",
  dateFrom: undefined as Date | undefined,
  dateTo: undefined as Date | undefined,
});

const presets = [
  { id: "today", label: "Dziś" },
  { id: "tomorrow", label: "Jutro" },
  { id: "nextWeek", label: "Następny tydzień" },
  { id: "past", label: "Minione" },
  { id: "all", label: "Wszystkie" },
];

// Obsługa ręcznej zmiany daty
const handleManualDateChange = () => {
  activePreset.value = "custom";
  filters.dateFrom = manualDates.from ? new Date(manualDates.from) : undefined;
  if (filters.dateFrom) filters.dateFrom.setHours(0, 0, 0, 0);

  filters.dateTo = manualDates.to ? new Date(manualDates.to) : undefined;
  if (filters.dateTo) filters.dateTo.setHours(23, 59, 59, 999);

  fetchSessions();
};

const setPreset = (preset: string) => {
  activePreset.value = preset;
  manualDates.from = "";
  manualDates.to = "";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  switch (preset) {
    case "today":
      filters.dateFrom = startOfToday;
      filters.dateTo = new Date(startOfToday);
      filters.dateTo.setHours(23, 59, 59, 999);
      break;
    case "tomorrow":
      filters.dateFrom = new Date(startOfToday);
      filters.dateFrom.setDate(filters.dateFrom.getDate() + 1);
      filters.dateTo = new Date(filters.dateFrom);
      filters.dateTo.setHours(23, 59, 59, 999);
      break;
    case "nextWeek":
      filters.dateFrom = startOfToday;
      filters.dateTo = new Date(startOfToday);
      filters.dateTo.setDate(filters.dateTo.getDate() + 7);
      break;
    case "past":
      filters.dateFrom = new Date(2020, 0, 1);
      filters.dateTo = new Date(now.getTime() - 1);
      break;
    case "all":
    default:
      filters.dateFrom = undefined;
      filters.dateTo = undefined;
      break;
  }
  fetchSessions();
};

const fetchSessions = async () => {
  try {
    loading.value = true;
    error.value = "";

    const requestBody = {
      pageNumber: 1,
      pageSize: 100,
      filters: {
        search: filters.searchText || undefined,
        dateStart: filters.dateFrom ? filters.dateFrom.toISOString() : undefined,
        dateEnd: filters.dateTo ? filters.dateTo.toISOString() : undefined,
        courseName: undefined,
        courseGroupName: undefined,
        locationName: undefined,
      },
      sortBy: "dateStart",
    };

    // Wywołanie specyficzne dla Studenta
    const response = await Backend.courseStudentSessionsGet(requestBody);
    sessions.value = response.items || [];
  } catch (err) {
    console.error("Błąd API (Student):", err);
    error.value = "Błąd pobierania danych.";
  } finally {
    loading.value = false;
  }
};

const handleActionDetails = (id: number) => {
  const path = `/student/session/${id}`;
  router.push(path);
};

const handleRegisterDevice = (token: string) => {
  if (token) {
    router.push(`/device/register/${token}`);
  } else {
    alert("Brak tokenu do rejestracji urządzenia.");
  }
};

const handleAttendance = () => {
  router.push(`/device/register/`);
};

const logout = () => {
  localStorage.removeItem("jwt_token");
  sessionStorage.clear();
  router.push("/login");
};

onMounted(fetchSessions);
</script>

<style scoped>
.active {
  background-color: #0d6efd !important;
  color: white !important;
}
</style>
