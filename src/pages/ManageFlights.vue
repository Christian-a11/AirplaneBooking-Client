<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/../api";
import { useGlobalStore } from "@/stores/global";
import notyf from "@/notyf";

const router = useRouter();
const globalStore = useGlobalStore();

const searchQuery = ref("");
const flights = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");

const fetchFlights = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const res = await api.get("/flights/all");
    flights.value = res.data || [];
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Failed to load flights.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchFlights();
});

const filteredFlights = computed(() => {
  if (!searchQuery.value.trim()) return flights.value;
  const q = searchQuery.value.toLowerCase();
  return flights.value.filter(
    (f) =>
      f.flightNumber?.toLowerCase().includes(q) ||
      f.departureAirport?.toLowerCase().includes(q) ||
      f.arrivalAirport?.toLowerCase().includes(q) ||
      f.airline?.toLowerCase().includes(q)
  );
});

const handleDeleteFlight = async (flightId) => {
  if (!confirm("Are you sure you want to delete this flight?")) return;
  try {
    const res = await api.delete(`/flights/${flightId}`);
    notyf.success(res.data?.message || 'Flight deleted successfully.');
    await fetchFlights();
  } catch (err) {
    const msg = err.response?.data?.message || "Failed to delete flight.";
    notyf.error(msg);
  }
};

const formatDate = (dt) => {
  if (!dt) return "";
  return new Date(dt).toLocaleString();
};
</script>

<template>
  <main class="w-100 pt-5 bg-background pb-5 mt-5">
    <div
      class="max-w-1400 mx-auto px-3 my-4 d-flex flex-column gap-4 position-relative"
    >
      <!-- Header Section -->
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end w-100 gap-3 z-1"
      >
        <div class="d-flex flex-column gap-1" style="max-width: 600px">
          <h1 class="font-display display-5 text-primary mb-0 tracking-tight">
            Flight Manifest
          </h1>
          <p class="font-body fs-6 text-on-surface-variant mb-0">
            Manage active routes, monitor seat availability, and update flight
            details across the network.
          </p>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button
            @click="router.push('/add-flight')"
            class="btn border-0 neomorph-btn-primary bg-primary text-on-primary px-4 py-2 rounded-3 font-headline small d-flex align-items-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined" style="font-size: 18px"
              >add</span
            >
            Add New Flight
          </button>
        </div>
      </div>

      <!-- Background Glow -->
      <div
        class="position-absolute top-0 end-0 rounded-circle blur-3"
        style="
          width: 400px;
          height: 400px;
          background: rgba(116, 209, 255, 0.15);
          pointer-events: none;
        "
      ></div>

      <div
        class="w-100 d-flex flex-column gap-3 neomorph-outset bg-surface p-4 rounded-4"
      >
        <!-- Filters / Search Bar -->
        <div
          class="d-flex align-items-center justify-content-between w-100 pb-3 border-bottom position-relative"
        >
          <div
            class="d-flex align-items-center gap-2 flex-grow-1"
            style="max-width: 400px"
          >
            <div
              class="position-relative w-100 neomorph-inset rounded-pill d-flex align-items-center bg-surface px-3"
              style="height: 42px"
            >
              <span
                class="material-symbols-outlined text-outline me-2"
                style="font-size: 20px"
                >search</span
              >
              <input
                v-model="searchQuery"
                class="w-100 bg-transparent border-0 outline-none font-body small text-on-surface"
                placeholder="Search by flight # or city..."
                type="text"
              />
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button
              class="btn border-0 neomorph-outset px-3 py-2 rounded-pill small font-headline text-primary d-flex align-items-center gap-1"
            >
              <span class="material-symbols-outlined" style="font-size: 16px"
                >filter_list</span
              >
              Filter
            </button>
            <button
              class="btn border-0 neomorph-outset px-3 py-2 rounded-pill small font-headline text-on-surface d-flex align-items-center gap-1"
            >
              <span class="material-symbols-outlined" style="font-size: 16px"
                >sort</span
              >
              Sort
            </button>
          </div>
        </div>

        <!-- Table Header (Desktop) -->

        <!-- Data Rows -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger my-3">
          {{ errorMessage }}
        </div>

        <div v-else-if="filteredFlights.length === 0" class="text-center py-4 text-on-surface-variant">
          No flights available.
        </div>

        <div v-else class="d-flex flex-column gap-2 w-100">
          <div
            v-for="flight in filteredFlights"
            :key="flight._id"
            class="row g-3 align-items-center p-3 neomorph-outset rounded-3 bg-surface transition-all card-hover"
          >
            <div class="col-12 col-md-2 d-flex align-items-center gap-2">
              <div
                class="rounded-circle neomorph-inset d-flex align-items-center justify-content-center bg-surface"
                style="width: 40px; height: 40px"
              >
                <span
                  class="material-symbols-outlined text-primary"
                  style="font-size: 20px"
                  >flight_takeoff</span
                >
              </div>
              <div class="d-flex flex-column">
                <span class="font-headline fs-6 text-on-surface">{{
                  flight.flightNumber
                }}</span>
                <span
                  class="small text-outline text-uppercase"
                  style="font-size: 11px"
                  >{{ flight.airline }}</span
                >
              </div>
            </div>

            <div class="col-12 col-md-3 d-flex align-items-center gap-3">
              <div class="d-flex flex-column">
                <span class="font-headline fs-6 text-on-surface">{{
                  flight.departureAirport
                }}</span>
              </div>

              <!-- Track line -->
              <div
                class="flex-grow-1 position-relative neomorph-inset rounded-pill bg-surface d-flex align-items-center px-1"
                style="height: 6px; max-width: 90px"
              >
                <span
                  class="material-symbols-outlined position-absolute start-50 top-50 translate-middle text-primary bg-surface rounded-circle neomorph-outset p-1"
                  style="
                    font-size: 14px;
                    transform: translate(-50%, -50%) rotate(90deg);
                  "
                  >flight</span
                >
              </div>

              <div class="d-flex flex-column text-end">
                <span class="font-headline fs-6 text-on-surface">{{
                  flight.arrivalAirport
                }}</span>
              </div>
            </div>

            <div class="col-12 col-md-3 d-flex flex-column">
              <span class="font-body small text-on-surface">{{
                formatDate(flight.departureDateTime)
              }}</span>
              <span class="small text-outline" style="font-size: 11px"
                >Duration: {{ flight.duration }} mins</span
              >
            </div>

            <div
              class="col-12 col-md-1 d-flex flex-md-column justify-content-between justify-content-md-center align-items-md-end text-end"
            >
              <span class="font-headline fs-6 text-primary"
                >${{ flight.basePrice }}</span
              >
            </div>

            <div
              class="col-12 col-md-2 d-flex flex-column gap-1 align-items-center justify-content-center"
            >
              <span class="small text-outline" style="font-size: 11px"
                >Available Seats: {{ flight.availableSeats }}</span
              >
              <span class="badge bg-secondary-subtle text-secondary small">{{ flight.status }}</span>
            </div>

            <div class="col-12 col-md-1 d-flex justify-content-end gap-2">
              <button
                @click="router.push(`/edit-flight/${flight._id}`)"
                class="btn border-0 rounded-circle neomorph-btn-primary d-flex align-items-center justify-content-center text-primary bg-surface p-0 cursor-pointer"
                style="width: 32px; height: 32px"
                title="Edit Flight"
              >
                <span class="material-symbols-outlined" style="font-size: 16px"
                  >edit</span
                >
              </button>
              <button
                @click="handleDeleteFlight(flight._id)"
                class="btn border-0 rounded-circle neomorph-btn-primary d-flex align-items-center justify-content-center text-danger bg-surface p-0 cursor-pointer"
                style="width: 32px; height: 32px"
                title="Delete Flight"
              >
                <span class="material-symbols-outlined" style="font-size: 16px"
                  >delete</span
                >
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}
.card-hover:hover {
  background-color: var(--surface-container-low) !important;
}
</style>
