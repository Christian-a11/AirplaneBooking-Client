<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/../api";

const router = useRouter();
const route = useRoute();

const bookingId = route.query.bookingId;
const booking = ref(null);
const flight = ref(null);
const passengers = ref([]);
const payment = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");
const copied = ref(false);

const fetchBooking = async () => {
  if (!bookingId) {
    isLoading.value = false;
    return;
  }
  try {
    const res = await api.get(`/bookings/specific/${bookingId}`);
    booking.value = res.data.booking;
    flight.value = res.data.booking?.flightId;
    passengers.value = res.data.passengers || [];

    try {
      const payRes = await api.get(`/payments/booking/${bookingId}`);
      payment.value = payRes.data;
    } catch (e) {
      // payment info optional display
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Failed to load booking information.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchBooking();
});

const copyPnr = () => {
  if (!booking.value?.bookingRef) return;
  navigator.clipboard.writeText(booking.value.bookingRef).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  });
};

const formatDate = (dt) => {
  if (!dt) return "";
  return new Date(dt).toLocaleDateString();
};

const formatTime = (dt) => {
  if (!dt) return "";
  return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <main class="w-100 pt-5 bg-background pb-5 mt-5">
    <div class="d-flex flex-column w-100 align-items-center justify-content-center pb-5 pt-3">
      <div class="w-100 max-w-1200 mx-auto px-3 d-flex flex-column align-items-center">
        <!-- Success Animation & Messaging -->
        <div class="position-relative mb-3">
          <div
            class="neomorph-outset rounded-circle d-flex align-items-center justify-content-center bg-surface position-relative z-1"
            style="width: 128px; height: 128px;"
          >
            <span
              class="material-symbols-outlined text-primary"
              style="font-size: 64px; font-variation-settings: 'FILL' 1;"
              >check_circle</span
            >
          </div>
          <div
            class="position-absolute inset-0 bg-primary opacity-25 rounded-circle blur-3"
            style="transform: scale(1.5); z-index: 0;"
          ></div>
        </div>

        <h1 class="font-display display-4 text-on-background text-center mb-2">
          Booking Confirmed
        </h1>
        <p class="font-body fs-5 text-on-surface-variant text-center mb-5" style="max-width: 600px;">
          Your journey is set. We've sent the itinerary and receipt to your registered email address. Safe travels.
        </p>

        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger my-4">
          {{ errorMessage }}
        </div>

        <!-- Ticket Card Container -->
        <div
          v-else-if="booking && flight"
          class="position-relative w-100 d-flex flex-column flex-md-row neomorph-outset bg-surface mb-5 overflow-hidden"
          style="max-width: 1000px; border-radius: 32px;"
        >
          <!-- Left Panel: Flight Details -->
          <div class="flex-grow-1 p-4 p-md-5 d-flex flex-column position-relative z-1 bg-surface">
            <!-- Ticket Header -->
            <div class="d-flex justify-content-between align-items-start mb-5">
              <div class="d-flex flex-col gap-1">
                <span class="small text-uppercase text-on-surface-variant tracking-widest fw-bold" style="font-size: 11px;"
                  >FLIGHT {{ flight.flightNumber }}</span
                >
                <div class="d-flex align-items-center gap-2 mt-1">
                  <span class="neomorph-inset rounded-circle d-flex align-items-center justify-content-center text-primary" style="width: 40px; height: 40px;">
                    <span class="material-symbols-outlined" style="font-size: 20px;">airlines</span>
                  </span>
                  <span class="font-headline fs-4 text-primary">{{ flight.airline }}</span>
                </div>
              </div>
              <div class="neomorph-inset px-3 py-2 rounded-pill d-flex align-items-center gap-2 bg-surface">
                <span class="spinner-grow spinner-grow-sm text-info" style="width: 10px; height: 10px;"></span>
                <span class="small text-uppercase text-on-surface-variant fw-bold" style="font-size: 11px;">{{ booking.bookingStatus }}</span>
              </div>
            </div>

            <!-- Flight Path & Times -->
            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center position-relative w-100 mb-5 gap-4 gap-sm-0">
              <div class="d-flex flex-column align-items-center align-items-sm-start z-1" style="width: 120px;">
                <span class="font-display display-5 text-on-background mb-1">{{ flight.departureAirport }}</span>
                <span class="font-headline fs-5 text-on-background mt-2">{{ formatTime(flight.departureDateTime) }}</span>
                <span class="small text-on-surface-variant">{{ formatDate(flight.departureDateTime) }}</span>
              </div>

              <div class="flex-grow-1 d-flex align-items-center justify-content-center position-relative w-100 px-sm-4">
                <div class="neomorph-outset rounded-circle d-flex align-items-center justify-content-center bg-surface text-primary position-relative z-1 shadow" style="width: 56px; height: 56px;">
                  <span class="material-symbols-outlined" style="font-size: 28px; transform: rotate(90deg);">flight</span>
                </div>
              </div>

              <div class="d-flex flex-column align-items-center align-items-sm-end z-1" style="width: 120px;">
                <span class="font-display display-5 text-on-background mb-1">{{ flight.arrivalAirport }}</span>
                <span class="font-headline fs-5 text-on-background mt-2">{{ formatTime(flight.arrivalDateTime) }}</span>
                <span class="small text-on-surface-variant">{{ formatDate(flight.arrivalDateTime) }}</span>
              </div>
            </div>

            <!-- Passenger Info Grid -->
            <div class="mt-auto pt-4 position-relative border-top">
              <div class="row g-3">
                <div class="col-6 col-sm-4 d-flex flex-column gap-1">
                  <span class="small text-uppercase text-on-surface-variant fw-bold" style="font-size: 11px;">PASSENGER</span>
                  <span class="font-headline fs-6 text-on-background">{{ passengers[0] ? `${passengers[0].firstName} ${passengers[0].lastName}` : 'Valued Traveler' }}</span>
                </div>
                <div class="col-6 col-sm-4 d-flex flex-column gap-1">
                  <span class="small text-uppercase text-on-surface-variant fw-bold" style="font-size: 11px;">TOTAL PAID</span>
                  <span class="font-headline fs-6 text-on-background">${{ booking.totalPrice }}</span>
                </div>
                <div class="col-6 col-sm-4 d-flex flex-column gap-1">
                  <span class="small text-uppercase text-on-surface-variant fw-bold" style="font-size: 11px;">TXN REF</span>
                  <span class="font-headline fs-6 text-on-background">{{ payment ? payment.transactionReference : 'COMPLETED' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Perforation Joint -->
          <div class="position-relative d-flex flex-md-column justify-content-between align-items-center w-100 w-md-auto bg-surface z-2 flex-shrink-0" style="min-width: 48px;">
            <div class="position-absolute inset-0 d-flex flex-md-column align-items-center justify-content-center opacity-25">
              <div class="w-100 border-top border-secondary border-dashed"></div>
            </div>
          </div>

          <!-- Right Panel: Stub & PNR -->
          <div class="w-100 w-md-auto p-4 p-md-5 bg-surface d-flex flex-column align-items-center justify-content-center position-relative z-1 flex-shrink-0" style="min-width: 300px;">
            <span class="small text-uppercase text-on-surface-variant mb-4 text-center fw-bold" style="font-size: 11px;">BOOKING REFERENCE</span>
            <button
              @click="copyPnr"
              class="btn border-0 neomorph-inset px-4 py-3 rounded-4 w-100 d-flex align-items-center justify-content-between gap-3 cursor-pointer"
              title="Click to copy"
            >
              <span v-if="copied" class="font-display fs-5 text-secondary text-uppercase">COPIED!</span>
              <template v-else>
                <span class="font-display fs-3 text-primary text-uppercase tracking-widest">{{ booking.bookingRef }}</span>
                <div class="d-flex flex-column align-items-center gap-1 text-on-surface-variant opacity-50">
                  <span class="material-symbols-outlined" style="font-size: 20px;">content_copy</span>
                  <span class="small" style="font-size: 9px;">COPY</span>
                </div>
              </template>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex flex-column flex-sm-row gap-3 w-100 justify-content-center" style="max-width: 600px;">
          <router-link
            to="/my-bookings"
            class="btn border-0 flex-fill neomorph-btn-primary bg-surface text-on-background font-headline fs-6 py-3 px-4 rounded-3 d-flex align-items-center justify-center gap-2 text-decoration-none cursor-pointer"
          >
            <span class="material-symbols-outlined">book_online</span>
            View My Bookings
          </router-link>
          <button
            @click="router.push('/')"
            class="btn border-0 flex-fill neomorph-btn-primary bg-primary text-on-primary font-headline fs-6 py-3 px-4 rounded-3 d-flex align-items-center justify-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined">home</span>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.tracking-widest {
  letter-spacing: 0.15em;
}
</style>
