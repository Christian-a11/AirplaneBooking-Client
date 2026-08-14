<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/../api'
import { useGlobalStore } from '@/stores/global'
import notyf from '@/notyf'

const router = useRouter()
const globalStore = useGlobalStore()

const activeTab = ref('Upcoming')
const bookings = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const fetchBookings = async () => {
  if (!globalStore.user.token) {
    router.push('/login')
    return
  }
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await api.get('/bookings/my-bookings')
    bookings.value = res.data || []
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to load bookings.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchBookings()
})

const filteredBookings = computed(() => {
  if (activeTab.value === 'Upcoming') {
    return bookings.value.filter(b => b.bookingStatus === 'pending' || b.bookingStatus === 'confirmed')
  }
  if (activeTab.value === 'Past') {
    return bookings.value.filter(b => b.bookingStatus === 'completed')
  }
  if (activeTab.value === 'Cancelled') {
    return bookings.value.filter(b => b.bookingStatus === 'cancelled')
  }
  return bookings.value
})

const handleCancelBooking = async (bookingId) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return
  try {
    const res = await api.patch(`/bookings/cancel/${bookingId}`)
    notyf.success(res.data?.message || 'Booking cancelled successfully.')
    await fetchBookings()
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to cancel booking.'
    notyf.error(msg)
  }
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
  <main class="w-100 pt-5 bg-background pb-5 mt-5">
    <div class="max-w-1200 mx-auto px-3 my-4 d-flex flex-column gap-4">
      <div class="d-flex flex-column gap-2">
        <h1 class="font-display display-5 text-primary mb-0">My Bookings</h1>
        <p class="font-body fs-6 text-on-surface-variant mb-0" style="max-width: 650px;">
          Manage your upcoming flights, review past itineraries, and keep track of your travel history seamlessly.
        </p>
      </div>

      <!-- Tabs -->
      <div class="d-flex gap-2 neomorph-inset p-2 rounded-4 w-auto me-auto mb-3">
        <button
          @click="activeTab = 'Upcoming'"
          :class="
            activeTab === 'Upcoming'
              ? 'neomorph-outset bg-surface text-primary font-headline'
              : 'text-on-surface-variant hover-primary'
          "
          class="btn border-0 px-4 py-2 rounded-3 font-headline small transition-all cursor-pointer"
        >
          Upcoming
        </button>
        <button
          @click="activeTab = 'Past'"
          :class="
            activeTab === 'Past'
              ? 'neomorph-outset bg-surface text-primary font-headline'
              : 'text-on-surface-variant hover-primary'
          "
          class="btn border-0 px-4 py-2 rounded-3 font-headline small transition-all cursor-pointer"
        >
          Past Flights
        </button>
        <button
          @click="activeTab = 'Cancelled'"
          :class="
            activeTab === 'Cancelled'
              ? 'neomorph-outset bg-surface text-primary font-headline'
              : 'text-on-surface-variant hover-primary'
          "
          class="btn border-0 px-4 py-2 rounded-3 font-headline small transition-all cursor-pointer"
        >
          Cancelled
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="errorMessage" class="alert alert-danger my-3">
        {{ errorMessage }}
      </div>

      <!-- Booking List -->
      <div v-else-if="filteredBookings.length > 0" class="d-flex flex-column gap-4">
        <div
          v-for="b in filteredBookings"
          :key="b._id"
          class="neomorph-outset rounded-4 p-4 d-flex flex-column flex-md-row gap-4 bg-surface-container-lowest position-relative overflow-hidden"
        >
          <div class="d-flex flex-column gap-1 shrink-0 border-start border-3 border-secondary ps-3 py-1" style="min-width: 160px;">
            <div class="d-flex align-items-center gap-2">
              <span class="rounded-circle bg-secondary" style="width: 8px; height: 8px;"></span>
              <span class="small text-uppercase text-secondary fw-bold" style="font-size: 11px;">{{ b.bookingStatus }}</span>
            </div>
            <div class="font-headline fs-6 text-on-surface">{{ formatDate(b.flightId?.departureDateTime) }}</div>
            <div class="small text-on-surface-variant">Ref: #{{ b.bookingRef }}</div>
          </div>

          <div class="flex-grow-1 d-flex flex-column justify-content-center">
            <div class="d-flex align-items-center justify-content-between w-100 position-relative">
              <div class="d-flex flex-column gap-1 w-33">
                <span class="font-headline fs-2 text-primary">{{ b.flightId?.departureAirport }}</span>
                <span class="font-headline fs-6 text-on-surface mt-1">{{ formatTime(b.flightId?.departureDateTime) }}</span>
              </div>

              <div class="flex-grow-1 d-flex flex-column align-items-center justify-content-center px-3 position-relative">
                <div class="w-100 border-top position-absolute top-50 translate-middle-y"></div>
                <span
                  class="material-symbols-outlined text-primary text-[32px] neomorph-outset bg-surface-container-lowest rounded-circle p-2 position-relative z-1"
                  style="transform: rotate(90deg);"
                  >flight</span
                >
                <span class="small text-on-surface-variant mt-2 text-center" style="font-size: 11px;">{{ b.flightId?.duration }} mins</span>
              </div>

              <div class="d-flex flex-column gap-1 w-33 align-items-end text-end">
                <span class="font-headline fs-2 text-primary">{{ b.flightId?.arrivalAirport }}</span>
                <span class="font-headline fs-6 text-on-surface mt-1">{{ formatTime(b.flightId?.arrivalDateTime) }}</span>
              </div>
            </div>
          </div>

          <div
            class="d-flex flex-row flex-md-column gap-3 align-items-center align-items-md-end justify-content-center border-md-start ps-md-4 pt-3 pt-md-0"
          >
            <button
              @click="router.push({ path: '/booking-confirmed', query: { bookingId: b._id } })"
              class="btn border-0 neomorph-btn-primary bg-primary text-on-primary font-headline small px-4 py-2 rounded-3 w-100 w-md-auto cursor-pointer"
            >
              View Details
            </button>
            <button
              v-if="b.bookingStatus !== 'cancelled' && b.bookingStatus !== 'completed'"
              @click="handleCancelBooking(b._id)"
              class="btn border-0 px-4 py-2 rounded-3 font-headline small text-danger w-100 w-md-auto cursor-pointer"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>

      <div v-else class="neomorph-outset rounded-4 p-5 text-center text-on-surface-variant">
        No {{ activeTab.toLowerCase() }} bookings found.
      </div>
    </div>
  </main>
</template>

<style scoped>
.hover-primary:hover {
  color: var(--primary) !important;
}
.w-33 {
  width: 33%;
}
</style>
