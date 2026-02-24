<template>
  <div>
    <button @click="$router.back()">Wróć do listy</button>

    <hr />

    <section></section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { Backend } from "@/main";

const route = useRoute();

const token = ref<string>(route.params.token as string);

const sessionInfo = ref<any>(null);
const ticketToken = ref<string | undefined>("");
// const attendanceMessage = ref<string>("");
const loading = ref(true);
const error = ref("");
const intervalId: any = null;

/**
 * 2. Pobieranie dynamicznego biletu (QR)
 * Wymaga wcześniejszej rejestracji urządzenia
 */

const registerDevice = async () => {
  try {
    // Metoda zwracająca token (ticket) do wyświetlenia jako QR
    const result = await Backend.userDeviceRegisterWithToken(token.value, {
      deviceName: "TestDevice",
      studentName: "Kacper",
      studentSurname: "B",
      albumIdNumber: 15236,
    });
    console.log("Pobrany token:", result);
    ticketToken.value = result.token;
    console.log("Pobrany token (ticket):", ticketToken.value);
    localStorage.setItem("deviceToken", ticketToken.value as string);
    alert("Urządzenie zarejestrowane! Możesz teraz zgłaszać obecność na zajęciach.");

    // Jeśli backend zwróci informację o ostatnio zarejestrowanej obecności
    // if (result.lastAttendanceMessage) {
    //   attendanceMessage.value = result.lastAttendanceMessage;
    // }
  } catch (err) {
    // Jeśli urządzenie nie jest zarejestrowane, tutaj może wystąpić błąd autoryzacji
    error.value = "Problem z pobraniem kodu. Upewnij się, że urządzenie jest zarejestrowane.";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await registerDevice();
});
</script>
