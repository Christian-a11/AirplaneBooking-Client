<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/../api'

const router = useRouter()

const origin = ref('Manila (MNL)')
const destination = ref('Cebu (CEB)')
const travelDate = ref(new Date().toISOString().split('T')[0])

const popularFlights = ref([])
const isLoadingPopular = ref(true)

const quickRoutes = [
  { label: 'MNL → CEB', from: 'Manila (MNL)', to: 'Cebu (CEB)' },
  { label: 'MNL → MPH', from: 'Manila (MNL)', to: 'Caticlan/Boracay (MPH)' },
  { label: 'MNL → DVO', from: 'Manila (MNL)', to: 'Davao (DVO)' },
  { label: 'CEB → IAO', from: 'Cebu (CEB)', to: 'Siargao (IAO)' },
  { label: 'MNL → PPS', from: 'Manila (MNL)', to: 'Palawan (PPS)' }
]

const selectQuickRoute = (r) => {
  origin.value = r.from
  destination.value = r.to
}

const swapCities = () => {
  const temp = origin.value
  origin.value = destination.value
  destination.value = temp
}

const fetchPopularFlights = async () => {
  isLoadingPopular.value = true
  try {
    const res = await api.get('/flights/popular')
    popularFlights.value = (res.data || []).slice(0, 3)
  } catch (err) {
    popularFlights.value = []
  } finally {
    isLoadingPopular.value = false
  }
}

onMounted(() => {
  fetchPopularFlights()
})

const parseAirportCode = (input) => {
  if (!input) return ''
  const match = String(input).match(/\(([A-Za-z]{3})\)/)
  if (match) return match[1].toUpperCase()
  return String(input).trim().toUpperCase()
}

const handleSearch = () => {
  router.push({
    path: '/search-results',
    query: {
      from: parseAirportCode(origin.value),
      to: parseAirportCode(destination.value),
      date: travelDate.value
    }
  })
}

const formatDate = (dt) => {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString()
}
const formatTime = (dt) => {
  if (!dt) return ''
  return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <main class="w-100 min-vh-100 bg-gradient-wrapper pt-5 pb-5 mt-5">
    <div class="max-w-1200 mx-auto px-3 d-flex flex-column gap-5 mb-5">
      
      <!-- Ambient Hero Glow -->
      <div class="ambient-glow"></div>

      <!-- Hero Section -->
      <section class="w-100 position-relative d-flex flex-column gap-4 pt-4 z-1">
        <div class="d-flex flex-column align-items-center text-center max-w-800 mx-auto">
          <div class="hero-badge mb-3 d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill">
            <span class="fs-6">✈️</span>
            <span class="small font-headline text-uppercase tracking-wider fw-bold">Premium Airline Experience</span>
          </div>
          
          <h1 class="font-display display-3 text-on-background mb-3 fw-bold hero-title">
            Where will the <span class="gradient-text">sky take you?</span>
          </h1>
          
          <p class="font-body fs-5 text-on-surface-variant mb-4 hero-subtitle">
            Experience effortless flight booking with real-time seat availability, transparent pricing, and instant electronic receipts.
          </p>

          <!-- Quick Route Chips -->
          <div class="d-flex flex-wrap justify-content-center align-items-center gap-2 mb-2">
            <span class="small text-on-surface-variant font-headline me-1">Popular:</span>
            <button
              v-for="route in quickRoutes"
              :key="route.label"
              @click="selectQuickRoute(route)"
              type="button"
              class="btn btn-sm quick-chip rounded-pill px-3 py-1 text-on-surface border-0 transition-all cursor-pointer"
            >
              {{ route.label }}
            </button>
          </div>
        </div>

        <!-- Flight Search Card -->
        <form
          @submit.prevent="handleSearch"
          class="glass-search-card rounded-4 p-4 p-md-5 d-flex flex-column gap-4 w-100 position-relative max-w-1000 mx-auto shadow-lg"
        >
          <div class="row g-3 align-items-end position-relative">
            <!-- Origin -->
            <div class="col-12 col-md-5 d-flex flex-column gap-2">
              <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold label-heading">From (Departure)</label>
              <div class="custom-input-box rounded-3 d-flex align-items-center px-3 gap-2">
                <span class="material-symbols-outlined text-primary fs-4">flight_takeoff</span>
                <div class="w-100">
                  <input
                    v-model="origin"
                    class="bg-transparent border-0 w-100 outline-none font-body text-on-surface fw-bold text-uppercase"
                    placeholder="E.g. MNL or Manila"
                    type="text"
                  />
                </div>
              </div>
            </div>

            <!-- Swap Button -->
            <div class="col-12 col-md-2 d-flex justify-content-center align-items-center my-md-0 my-1">
              <button
                type="button"
                @click="swapCities"
                class="btn swap-btn rounded-circle d-flex align-items-center justify-center p-0 transition-all shadow-sm"
                title="Swap origin & destination"
              >
                <span class="material-symbols-outlined text-primary">swap_horiz</span>
              </button>
            </div>

            <!-- Destination -->
            <div class="col-12 col-md-5 d-flex flex-column gap-2">
              <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold label-heading">To (Destination)</label>
              <div class="custom-input-box rounded-3 d-flex align-items-center px-3 gap-2">
                <span class="material-symbols-outlined text-primary fs-4">flight_land</span>
                <div class="w-100">
                  <input
                    v-model="destination"
                    class="bg-transparent border-0 w-100 outline-none font-body text-on-surface fw-bold text-uppercase"
                    placeholder="E.g. CEB or Cebu"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="row g-3 align-items-end">
            <!-- Date -->
            <div class="col-12 col-md-8 d-flex flex-column gap-2">
              <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold label-heading">Departure Date</label>
              <div class="custom-input-box rounded-3 d-flex align-items-center px-3 gap-2">
                <span class="material-symbols-outlined text-primary fs-4">calendar_month</span>
                <input
                  v-model="travelDate"
                  class="bg-transparent border-0 w-100 outline-none font-body text-on-surface fw-bold text-uppercase"
                  type="date"
                />
              </div>
            </div>

            <!-- Search Button -->
            <div class="col-12 col-md-4 d-flex">
              <button
                type="submit"
                class="btn btn-search-primary w-100 rounded-3 font-headline fs-5 py-3 d-flex align-items-center justify-content-center gap-2 cursor-pointer shadow"
              >
                <span class="material-symbols-outlined">search</span>
                Search Flights
              </button>
            </div>
          </div>
        </form>
      </section>

      <!-- Key Features / Perks -->
      <section class="w-100 my-2 z-1">
        <div class="row g-4">
          <div class="col-12 col-md-4">
            <div class="feature-card p-4 rounded-4 d-flex align-items-center gap-3">
              <div class="feature-icon-wrapper rounded-circle p-3 d-flex align-items-center justify-center">
                <span class="material-symbols-outlined text-primary fs-3">verified_user</span>
              </div>
              <div>
                <h5 class="font-headline fs-6 mb-1 text-on-surface fw-bold">Secure Bookings</h5>
                <p class="small text-on-surface-variant mb-0">End-to-end encrypted transactions and instant digital receipts.</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="feature-card p-4 rounded-4 d-flex align-items-center gap-3">
              <div class="feature-icon-wrapper rounded-circle p-3 d-flex align-items-center justify-center">
                <span class="material-symbols-outlined text-primary fs-3">flight_class</span>
              </div>
              <div>
                <h5 class="font-headline fs-6 mb-1 text-on-surface fw-bold">No Hidden Fees</h5>
                <p class="small text-on-surface-variant mb-0">Transparent flight rates with clear baggage & tax breakdowns.</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="feature-card p-4 rounded-4 d-flex align-items-center gap-3">
              <div class="feature-icon-wrapper rounded-circle p-3 d-flex align-items-center justify-center">
                <span class="material-symbols-outlined text-primary fs-3">support_agent</span>
              </div>
              <div>
                <h5 class="font-headline fs-6 mb-1 text-on-surface fw-bold">24/7 Assistance</h5>
                <p class="small text-on-surface-variant mb-0">Dedicated support team to assist with updates and cancellations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Most Booked Flights Section -->
      <section class="w-100 d-flex flex-column gap-4 z-1 mt-3">
        <div class="d-flex flex-column flex-sm-row align-items-sm-end justify-content-between gap-2">
          <div>
            <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 small font-headline mb-2 text-uppercase">Trending Routes</span>
            <h2 class="font-display fs-2 text-on-background mb-1 fw-bold">
              Most Booked Flights
            </h2>
            <p class="font-body fs-6 text-on-surface-variant mb-0">
              Top popular choices based on real reservation volume across the network.
            </p>
          </div>
          <router-link
            to="/search-results"
            class="btn view-all-btn px-4 py-2 rounded-pill small d-flex align-items-center gap-2 text-decoration-none fw-bold shadow-sm"
          >
            Explore All Flights
            <span class="material-symbols-outlined fs-6">arrow_forward</span>
          </router-link>
        </div>

        <div v-if="isLoadingPopular" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="popularFlights.length === 0" class="text-center py-4 text-on-surface-variant">
          No popular flights available right now.
        </div>

        <div v-else class="row g-4">
          <div
            v-for="(flight, idx) in popularFlights.slice(0, 3)"
            :key="flight._id"
            class="col-12 col-md-4"
          >
            <div
              @click="router.push({ path: '/passenger-details', query: { flightId: flight._id } })"
              class="escape-card rounded-4 p-4 d-flex flex-column justify-content-between cursor-pointer transition-all shadow-sm h-100"
            >
              <div>
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <span class="badge bg-primary-container text-on-primary-container rounded-pill px-3 py-1 font-headline small">
                    #{{ idx + 1 }} MOST BOOKED
                  </span>
                  <span v-if="flight.totalBookings" class="badge bg-secondary-subtle text-secondary rounded-pill px-2 py-1 small">
                    🔥 {{ flight.totalBookings }} Booking(s)
                  </span>
                </div>

                <div class="d-flex align-items-center gap-2 mb-3">
                  <span class="material-symbols-outlined text-primary fs-3">airlines</span>
                  <div>
                    <h3 class="font-headline fs-5 text-on-surface mb-0 fw-bold">
                      {{ flight.airline }}
                    </h3>
                    <span class="small text-on-surface-variant">Flight {{ flight.flightNumber }}</span>
                  </div>
                </div>

                <!-- Flight Route -->
                <div class="d-flex align-items-center justify-content-between bg-light rounded-3 p-3 mb-3">
                  <div class="d-flex flex-column">
                    <span class="font-display fs-4 text-primary fw-bold">{{ flight.departureAirport }}</span>
                    <span class="small text-on-surface-variant">{{ formatTime(flight.departureDateTime) }}</span>
                  </div>
                  <div class="d-flex flex-column align-items-center">
                    <span class="material-symbols-outlined text-secondary" style="transform: rotate(90deg);">flight</span>
                    <span class="small text-on-surface-variant" style="font-size: 10px;">{{ flight.duration }}m</span>
                  </div>
                  <div class="d-flex flex-column text-end">
                    <span class="font-display fs-4 text-primary fw-bold">{{ flight.arrivalAirport }}</span>
                    <span class="small text-on-surface-variant">{{ formatTime(flight.arrivalDateTime) }}</span>
                  </div>
                </div>
              </div>

              <div class="d-flex align-items-center justify-content-between pt-3 border-top">
                <div class="d-flex flex-column">
                  <span class="small text-on-surface-variant" style="font-size: 12px;">Base Price</span>
                  <span class="font-headline fs-4 text-primary fw-bold">${{ flight.basePrice }}</span>
                </div>
                <button class="btn btn-search-primary px-3 py-2 rounded-3 small font-headline d-flex align-items-center gap-1">
                  Book Now
                  <span class="material-symbols-outlined fs-6">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </main>
</template>

<style scoped>
/* Page Background & Ambient Glow */
.bg-gradient-wrapper {
  background: linear-gradient(180deg, #f0f7ff 0%, #f8fafc 100%);
  position: relative;
  overflow: hidden;
}

.ambient-glow {
  position: absolute;
  top: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 119, 204, 0.12) 0%, rgba(240, 247, 255, 0) 70%);
  pointer-events: none;
  z-index: 0;
}

/* Hero Elements */
.hero-badge {
  background: rgba(0, 94, 163, 0.08);
  border: 1px solid rgba(0, 94, 163, 0.18);
  color: #005ea3;
}

.gradient-text {
  background: linear-gradient(135deg, #005ea3 0%, #0099ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  max-width: 640px;
  line-height: 1.6;
}

.quick-chip {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.quick-chip:hover {
  background: #005ea3;
  color: #ffffff !important;
  border-color: #005ea3;
}

/* Glass Search Card */
.glass-search-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 40px rgba(0, 94, 163, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

.label-heading {
  letter-spacing: 0.05em;
}

.custom-input-box {
  height: 54px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.custom-input-box:focus-within {
  border-color: #005ea3;
  box-shadow: 0 0 0 3px rgba(0, 94, 163, 0.15);
}

.swap-btn {
  width: 44px;
  height: 44px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
}

.swap-btn:hover {
  background: #f1f5f9;
  transform: rotate(180deg);
}

.btn-search-primary {
  background: linear-gradient(135deg, #005ea3 0%, #0077cc 100%);
  color: #ffffff;
  border: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-search-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 94, 163, 0.25) !important;
  color: #ffffff;
}

/* Feature Cards */
.feature-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.feature-icon-wrapper {
  background: rgba(0, 94, 163, 0.08);
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

/* Escape Cards */
.escape-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.escape-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08) !important;
}

.escape-card:hover .escape-img {
  transform: scale(1.05);
}

.escape-img {
  transition: transform 0.4s ease;
}

.escape-tag {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  color: #005ea3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.view-all-btn {
  background: #ffffff;
  border: 1px solid #005ea3;
  color: #005ea3;
  transition: all 0.2s;
}

.view-all-btn:hover {
  background: #005ea3;
  color: #ffffff;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

