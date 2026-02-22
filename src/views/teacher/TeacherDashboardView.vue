<template>
  <div>
    <header class="p-2">
      <span>AttendMe - Teacher</span>
      <button @click="logout" class="btn btn-primary">Wyloguj</button>
      <!-- <button @click="registerDevice" class="btn btn-primary">Zarejestruj urządzenie</button> -->
    </header>

    <section class="filters-container">
      <div class="search-bar">
        <label>Wyszukaj (przedmiot, lokalizacja):</label>
        <input
          v-model="filters.searchText"
          type="text"
          placeholder="Np. Programowanie, Sala 101"
          @input="fetchSessions"
        />
      </div>

      <div class="date-presets">
        <label>Zakres czasu:</label>
        <div class="button-group">
          <button :class="{ active: activePreset === 'today' }" @click="setPreset('today')">
            Dziś
          </button>
          <button :class="{ active: activePreset === 'tomorrow' }" @click="setPreset('tomorrow')">
            Jutro
          </button>
          <button :class="{ active: activePreset === 'nextWeek' }" @click="setPreset('nextWeek')">
            Następny tydzień
          </button>
          <button :class="{ active: activePreset === 'past' }" @click="setPreset('past')">
            Minione
          </button>
          <button :class="{ active: activePreset === 'all' }" @click="setPreset('all')">
            Wszystkie
          </button>
        </div>
      </div>
    </section>

    <SessionsList
      :sessions="sessions"
      :loading="loading"
      actionLabel="Otwórz listę obecności"
      @action="handleDetails"
    />
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
const activePreset = ref("all");

const filters = reactive({
  searchText: "",
  dateFrom: undefined as Date | undefined,
  dateTo: undefined as Date | undefined,
});

const setPreset = (preset: string) => {
  activePreset.value = preset;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  switch (preset) {
    case "today":
      filters.dateFrom = new Date(now);
      filters.dateTo = new Date(now);
      filters.dateTo.setHours(23, 59, 59, 999);
      break;
    case "tomorrow":
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      filters.dateFrom = new Date(tomorrow);
      filters.dateTo = new Date(tomorrow);
      filters.dateTo.setHours(23, 59, 59, 999);
      break;
    case "nextWeek":
      filters.dateFrom = new Date(now);
      filters.dateTo = new Date(now);
      filters.dateTo.setDate(now.getDate() + 7);
      break;
    case "past":
      filters.dateFrom = new Date(2020, 0, 1); // Dowolna data z przeszłości
      filters.dateTo = new Date(now);
      filters.dateTo.setSeconds(now.getSeconds() - 1);
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
    // Wywołanie metody POST /course/teacher/sessions/get z filtrami
    const response = await Backend.courseTeacherSessionsGet({
      pageNumber: 1,
      pageSize: 100,
      filters: {
        search: filters.searchText || undefined,
        dateStart: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
        dateEnd: filters.dateTo ? new Date(filters.dateTo) : undefined,
      },
    });
    sessions.value = response.items || [];
  } catch (err) {
    console.error("Błąd pobierania:", err);
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  filterParams.searchText = "";
  filterParams.dateFrom = "";
  filterParams.dateTo = "";
  fetchSessions();
};

const logout = () => {
  localStorage.removeItem("jwt_token");
  sessionStorage.clear();
  router.push("/login");
};

const registerDevice = () => {
  // Przekierowanie do widoku rejestracji urządzenia
  router.push("/device-registration");
};

const handleDetails = (id: number) => router.push(`/teacher/session/${id}`);

onMounted(fetchSessions);
</script>
