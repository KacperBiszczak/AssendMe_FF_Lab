<template>
  <main class="login-container">
    <h2>AttendMe - Logowanie</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Login:</label>
        <input v-model="loginData.loginName" type="text" required />
      </div>
      <div class="form-group">
        <label>Hasło:</label>
        <input v-model="loginData.password" type="password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? "Logowanie..." : "Zaloguj się" }}
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { Backend } from "@/main";

const router = useRouter();
const loading = ref(false);
const errorMessage = ref("");

const loginData = reactive({
  loginName: "",
  password: "",
});

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    await Backend.userLogin(loginData.loginName, loginData.password);

    const user = await Backend.userGet(undefined);

    console.log("Zalogowany użytkownik:", user);

    // Przekierowanie na podstawie roli
    if (user.isTeacher === true) {
      sessionStorage.setItem("userRole", "Teacher");
      router.push("/teacher/dashboard");
    } else if (user.isStudent === true) {
      sessionStorage.setItem("userRole", "Student");
      router.push("/student/dashboard");
    } else {
      errorMessage.value = "Nieznana rola użytkownika.";
    }
  } catch (err) {
    errorMessage.value = "Błąd logowania. Sprawdź dane i spróbuj ponownie.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
