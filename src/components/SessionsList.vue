<template>
  <div>
    <div v-if="loading">
      <p>Ładowanie zajęć...</p>
    </div>

    <div v-else-if="sessions.length === 0">
      <p>Brak zaplanowanych zajęć.</p>
    </div>

    <div v-else>
      <div v-for="session in sessions" :key="session.id" class="card mb-3">
        <div class="card-body">
          <h3 class="card-title">{{ session.courseName }}</h3>

          <div class="card-subtitle mb-2 text-muted">
            Status: {{ session.attendanceStatus || "Oczekuje" }}
          </div>

          <ul>
            <li>Czas: {{ formatDate(session.dateStart) }}</li>
            <li>Grupa: {{ session.courseGroupName }}</li>
            <li>Sala: {{ session.locationName || "Brak danych" }}</li>
          </ul>

          <button @click="$emit('action', session.courseSessionId)" class="btn btn-primary">
            {{ actionLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Definicja właściwości wejściowych (props)
defineProps<{
  sessions: any[];
  loading: boolean;
  actionLabel: string;
}>();

// Definicja zdarzeń (emits)
defineEmits(["action"]);

const formatDate = (dateString: string | Date | undefined | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("pl-PL");
};
</script>
