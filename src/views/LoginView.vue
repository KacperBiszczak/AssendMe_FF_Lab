<template>
  <main class="login-container">
    <h2>AttendMe - Logowanie</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group mt-2">
        <label for="loginInput">Login</label>
        <input
          class="form-control"
          v-model="loginData.loginName"
          id="loginInput"
          type="text"
          required
        />
      </div>
      <div class="form-group mt-2">
        <label for="passwordInput">Hasło</label>
        <input
          class="form-control"
          v-model="loginData.password"
          id="passwordInput"
          type="password"
          required
        />
      </div>
      <button class="btn btn-primary btn-lg btn-block mt-2 w-100" type="submit" :disabled="loading">
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

    // if (authResult && authResult.token) {
    //   localStorage.setItem("jwt_token", authResult.token);
    // }

    const user = await Backend.userGet(undefined);

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
