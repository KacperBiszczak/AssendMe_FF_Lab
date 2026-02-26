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

          <!-- <div v-if="userRole == 'Student'" class="card-subtitle mb-2 text-muted">
            Status: {{ session.attendanceStatus || "Oczekuje" }}
          </div> -->

          <ul>
            <li>Grupa: {{ session.courseGroupName }}</li>
            <li>Termin: {{ session.dateStart?.toLocaleString("pl-PL") }}</li>
            <li>Sala: {{ session.locationName || "Brak danych" }}</li>
          </ul>

          <button @click="$emit('actionDetails', session.courseSessionId)" class="btn btn-primary">
            {{ actionLabelDetails }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CourseSessionListItem } from "@/backend/AttendMeBackendClientBase";

// Definicja właściwości wejściowych (props)
defineProps<{
  sessions: CourseSessionListItem[];
  loading: boolean;
  actionLabelDetails: string;
  actionLabelAttendance: string;
  handleAttendance?: (token: string) => void;
  handleRegisterDevice?: (token: string) => void;
}>();

// Definicja zdarzeń (emits)
defineEmits(["actionDetails", "actionLabelAttendance"]);
</script>
