<template>
  <main>
    <h1>Logowanie</h1>
    <select v-model="loginType" @change="result = undefined" style="padding: 0.25rem">
      <option :value="null">- WYBIERZ -</option>
      <option :value="'teacher'">WYKŁADOWCA</option>
      <option :value="'student'">STUDENT</option>
    </select>

    <div v-if="loginType === 'teacher'" style="margin-top: 1rem">
      <input
        v-model="teacherLogin"
        type="text"
        placeholder="Login"
        style="display: block; margin-bottom: 0.5rem; padding: 0.25rem"
      />
      <input
        v-model="teacherPassword"
        type="password"
        placeholder="Hasło"
        style="display: block; margin-bottom: 0.5rem; padding: 0.25rem"
      />
      <button
        @click="
          result = Backend.loginTeacher(teacherLogin, teacherPassword);
          teacherLogin = '';
          teacherPassword = '';
        "
        style="padding: 0.25rem 0.5rem"
      >
        Zaloguj się jako wykładowca
      </button>
  </main>
</template>

<script setup lang="ts">
import { Backend } from "@/main";
import { ref } from "vue";

const teacherLogin = ref("");
const teacherPassword = ref("");
const studentLogin = ref("");
const studentPassword = ref("");
const loginType = ref<string | null>(null);
const result = ref();
</script>
