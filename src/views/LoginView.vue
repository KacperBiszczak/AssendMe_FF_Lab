<template>
  <main>
    <h1>Logowanie</h1>
    <select v-model="loginType" @change="result = undefined" style="padding: 0.25rem">
      <option :value="null">- WYBIERZ -</option>
      <option :value="'teacher'">WYKŁADOWCA</option>
      <option :value="'student'">STUDENT</option>
    </select>

    <div v-if="loginType == 'wykladowca'">
      <input type="text" v-model="teacherLogin" placeholder="Login wykładowcy" />
      <input type="password" v-model="teacherPassword" placeholder="Hasło wykładowcy" />
    </div>

    <div v-else-if="loginType == 'student'">
      <label for="studentLogin">Login studenta:</label>
      <input type="text" v-model="studentLogin" placeholder="Login studenta" id="studentLogin" />

      <label for="studentPassword">Hasło studenta:</label>
      <input
        type="password"
        v-model="studentPassword"
        placeholder="Hasło studenta"
        id="studentPassword"
      />
    </div>
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
