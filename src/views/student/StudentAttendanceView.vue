<template>
  <div>
    <button class="btn btn-secondary w-100" @click="$router.back()">Wróć do listy</button>

    <hr />

    <section>
      <div v-if="qrValue">
        <h3>Twój kod QR:</h3>
        <!-- <qrcode-vue :value="qrValue" :size="250" level="H" /> -->

        <qrcode-svg
          :value="qrValue"
          :size="250"
          :level="'L'"
          :background="'#ffffff'"
          :foreground="'#000000'"
          :render-as="'svg'"
          :margin="0"
        />

        <p>Kod odświeża się co 2 sekundy</p>
      </div>

      <div v-else-if="loading && !error">Generowanie biletu...</div>

      <p v-if="error" style="color: red">{{ error }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { QrcodeSvg } from "qrcode.vue";
import { Backend } from "@/main";

const qrValue = ref<string>("");
const loading = ref(true);
const error = ref("");
let timer: ReturnType<typeof setInterval> | null = null;

const fetchTicket = async () => {
  try {
    const response = await Backend.userAttendanceTicketGet();

    qrValue.value = typeof response === "string" ? response : response.token;
    error.value = "";
  } catch (err) {
    error.value = "Nie udało się pobrać kodu QR.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTicket();

  timer = setInterval(fetchTicket, 2000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
