<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/../api";

const router = useRouter();
const route = useRoute();

const fromCity = ref(route.query.from || "");
const toCity = ref(route.query.to || "");
const travelDate = ref(route.query.date || "");

const flights = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");
const selectedSort = ref("Recommended");

const parseAirportCode = (input) => {
  if (!input) return "";
  const match = String(input).match(/\(([A-Za-z]{3})\)/);
  if (match) return match[1].toUpperCase();
  return String(input).trim().toUpperCase();
};

const fetchFlights = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    let res;
    const dep = parseAirportCode(fromCity.value);
    const arr = parseAirportCode(toCity.value);
    if (dep && arr && travelDate.value) {
      res = await api.get("/flights/search", {
        params: {
          departureAirport: dep,
          arrivalAirport: arr,
          date: travelDate.value,
          passengers: 1,
        },
      });
      flights.value = res.data.flights || [];
    } else {
      res = await api.get("/flights/all");
      flights.value = res.data || [];
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Failed to load flights.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchFlights();
});

const sortedFlights = computed(() => {
  // Show only available, non-cancelled flights with open seats
  let list = flights.value.filter((f) => {
    const isNotCancelled = f.status !== "cancelled" && f.status !== "completed" && f.status !== "departed";
    const hasSeats = Number(f.availableSeats) > 0;
    return isNotCancelled && hasSeats;
  });

  if (selectedSort.value === "Price (Lowest)") {
    return list.sort((a, b) => a.basePrice - b.basePrice);
  }
  if (selectedSort.value === "Duration (Shortest)") {
    return list.sort((a, b) => a.duration - b.duration);
  }
  if (selectedSort.value === "Departure (Earliest)") {
    return list.sort((a, b) => new Date(a.departureDateTime) - new Date(b.departureDateTime));
  }
  return list;
});

const selectFlight = (flightId) => {
  router.push({
    path: "/passenger-details",
    query: { flightId },
  });
};

const formatDate = (dt) => {
  if (!dt) return "";
  return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <main class="w-100 pt-5 bg-background pb-5 mt-5">
    <div class="max-w-1400 mx-auto px-3 my-4">
      <!-- Main Results Area -->
      <section class="w-100 d-flex flex-column gap-3">
        <!-- Header / Sort -->
        <div class="d-flex justify-content-between align-items-end mb-2">
          <div>
            <h1 class="font-display display-5 text-on-background mb-0">
              {{ fromCity || "All Available Flights" }}
              <span v-if="toCity" class="text-outline-variant font-light mx-2">→</span>
              {{ toCity }}
            </h1>
            <p class="font-body text-on-surface-variant small mb-0 mt-1">
              Showing {{ sortedFlights.length }} flight(s)
            </p>
          </div>
          <div class="d-none d-sm-flex align-items-center gap-2">
            <span class="small text-on-surface-variant">Sort by:</span>
            <select
              v-model="selectedSort"
              class="form-select form-select-sm neomorph-inset bg-surface-container rounded-3 border-0 px-3 text-on-surface"
              style="width: 180px"
            >
              <option>Recommended</option>
              <option>Price (Lowest)</option>
              <option>Duration (Shortest)</option>
              <option>Departure (Earliest)</option>
            </select>
          </div>
        </div>

        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger my-3">
          {{ errorMessage }}
        </div>

        <div v-else-if="sortedFlights.length === 0" class="text-center py-5 text-on-surface-variant">
          <span class="material-symbols-outlined display-1">flight_off</span>
          <p class="mt-2 fs-5">No flights found matching your query.</p>
        </div>

        <!-- Flight Cards List -->
        <div v-else class="d-flex flex-column gap-4">
          <article
            v-for="flight in sortedFlights"
            :key="flight._id"
            class="neomorph-outset bg-surface-container rounded-4 p-4 d-flex flex-column gap-3 card-hover transition-all"
          >
            <div
              class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3"
            >
              <div class="d-flex align-items-center gap-3">
                <div
                  class="rounded-circle neomorph-inset d-flex align-items-center justify-content-center bg-surface"
                  style="width: 48px; height: 48px"
                >
                  <span
                    class="material-symbols-outlined text-primary"
                    style="
                      font-size: 28px;
                      font-variation-settings: &quot;FILL&quot; 1;
                    "
                    >flight</span
                  >
                </div>
                <div class="d-flex flex-column">
                  <span class="font-headline fs-6 text-on-surface"
                    >{{ flight.airline }}</span
                  >
                  <span class="small text-on-surface-variant"
                    >Flight {{ flight.flightNumber }} · {{ flight.aircraft || 'Commercial' }}</span
                  >
                </div>
              </div>

              <div
                class="d-flex flex-sm-column align-items-center align-items-sm-end justify-content-between w-100 w-sm-auto gap-2"
              >
                <div class="d-flex flex-column align-items-sm-end">
                  <span class="font-display fs-2 text-primary fw-bold"
                    >${{ flight.basePrice }}</span
                  >
                  <span class="small text-on-surface-variant"
                    >One way per traveler</span
                  >
                </div>
                <button
                  @click="selectFlight(flight._id)"
                  class="btn border-0 neomorph-btn-primary bg-primary text-on-primary px-4 py-2 rounded-3 font-headline small text-nowrap cursor-pointer"
                >
                  Select Flight
                </button>
              </div>
            </div>

            <div
              class="border-top border-secondary-subtle opacity-50 my-2"
            ></div>

            <div class="row align-items-center text-center text-sm-start g-3">
              <div class="col-12 col-sm-3 d-flex flex-column">
                <span class="font-headline fs-3 text-on-surface">{{ formatDate(flight.departureDateTime) }}</span>
                <span class="font-headline fs-6 text-on-surface-variant"
                  >{{ flight.departureAirport }}</span
                >
              </div>

              <div
                class="col-12 col-sm-6 d-flex flex-column align-items-center px-3"
              >
                <div class="d-flex justify-content-between w-100 small mb-1">
                  <span
                    class="small text-uppercase text-primary fw-bold"
                    style="font-size: 11px"
                    >{{ flight.duration }} mins</span
                  >
                  <span
                    class="small text-uppercase text-on-surface-variant"
                    style="font-size: 11px"
                    >{{ flight.status }}</span
                  >
                </div>
                <div
                  class="w-100 neomorph-inset rounded-pill bg-surface-container-high position-relative d-flex align-items-center px-1"
                  style="height: 12px"
                >
                  <div
                    class="position-absolute start-50 translate-middle-x rounded-circle neomorph-outset bg-surface d-flex align-items-center justify-content-center z-1"
                    style="width: 24px; height: 24px"
                  >
                    <span
                      class="material-symbols-outlined text-primary"
                      style="font-size: 16px; transform: rotate(90deg)"
                      >flight</span
                    >
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-3 d-flex flex-column text-sm-end">
                <span class="font-headline fs-3 text-on-surface">{{ formatDate(flight.arrivalDateTime) }}</span>
                <span class="font-headline fs-6 text-on-surface-variant"
                  >{{ flight.arrivalAirport }}</span
                >
              </div>
            </div>

            <div
              class="d-flex justify-content-between align-items-center pt-2 border-top"
            >
              <div class="d-flex align-items-center gap-1">
                <span
                  class="material-symbols-outlined text-secondary"
                  style="font-size: 16px"
                  >airline_seat_recline_extra</span
                >
                <span class="small text-secondary"
                  >{{ flight.availableSeats }} seats left</span
                >
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.card-hover:hover {
  transform: translateY(-4px);
}
</style>
