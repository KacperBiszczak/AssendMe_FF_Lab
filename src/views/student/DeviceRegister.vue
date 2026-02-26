<template>
  <div>
    <button class="btn btn-secondary w-100" @click="$router.back()">Wróć do listy</button>
    <hr />

    <form @submit.prevent="registerDevice">
      <div class="form-group mt-2">
        <label for="loginInput">Nazwa urządzenia</label>
        <input
          class="form-control"
          v-model="registerDeviceData.deviceName"
          id="loginInput"
          type="text"
          required
        />
      </div>
      <div class="form-group mt-2">
        <label for="passwordInput">Imię</label>
        <input
          class="form-control"
          v-model="registerDeviceData.studentName"
          id="passwordInput"
          type="text"
          required
        />
      </div>
      <div class="form-group mt-2">
        <label for="passwordInput">Nazwisko</label>
        <input
          class="form-control"
          v-model="registerDeviceData.studentSurname"
          id="passwordInput"
          type="text"
          required
        />
      </div>
      <div class="form-group mt-2">
        <label for="passwordInput">Numer albumu</label>
        <input
          class="form-control"
          v-model.number="registerDeviceData.albumIdNumber"
          id="passwordInput"
          type="number"
          required
        />
      </div>
      <button class="btn btn-primary btn-lg btn-block mt-2 w-100" type="submit" :disabled="loading">
        {{ loading ? "Rejestrowanie urządzenia..." : "Zarejestruj urządzenie" }}
      </button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>

    <section></section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { Backend } from "@/main";
import router from "@/router";

const route = useRoute();

const token = ref<string>(route.params.token as string);

const sessionInfo = ref<any>(null);
const ticketToken = ref<string | undefined>("");
// const attendanceMessage = ref<string>("");
const loading = ref(true);
const error = ref("");
const intervalId: any = null;

const registerDeviceData = reactive({
  deviceName: "",
  studentName: "",
  studentSurname: "",
  albumIdNumber: 0,
});
/**
 * 2. Pobieranie dynamicznego biletu (QR)
 * Wymaga wcześniejszej rejestracji urządzenia
 */

const registerDevice = async () => {
  try {
    // if (ticketToken.value != "") {
    //   router.push("/student/dashboard");
    // }
    // Metoda zwracająca token (ticket) do wyświetlenia jako QR
    const result = await Backend.userDeviceRegisterWithToken(token.value, {
      deviceName: registerDeviceData.deviceName,
      studentName: registerDeviceData.studentName,
      studentSurname: registerDeviceData.studentSurname,
      albumIdNumber: registerDeviceData.albumIdNumber,
    });
    ticketToken.value = result.token;
    localStorage.setItem("deviceToken", ticketToken.value as string);
    alert("Urządzenie zarejestrowane! Możesz teraz zgłaszać obecność na zajęciach.");
    router.push("/student/dashboard");

    // Jeśli backend zwróci informację o ostatnio zarejestrowanej obecności
    // if (result.lastAttendanceMessage) {
    //   attendanceMessage.value = result.lastAttendanceMessage;
    // }
  } catch (err) {
    // Jeśli urządzenie nie jest zarejestrowane, tutaj może wystąpić błąd autoryzacji
    error.value = "Problem z rejestracją urządzenia. Sprawdź czy token jest poprawny.";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await registerDevice();
});
</script>
