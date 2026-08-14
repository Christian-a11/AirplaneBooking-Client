<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/../api'
import notyf from '@/notyf'

const router = useRouter()
const route = useRoute()

const flightId = route.params.flightId
const flightNumber = ref('')
const airline = ref('')
const aircraft = ref('')
const departureAirport = ref('')
const arrivalAirport = ref('')
const departureDateTime = ref('')
const arrivalDateTime = ref('')
const duration = ref('')
const basePrice = ref('')
const availableSeats = ref('')
const status = ref('scheduled')

const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')

const toLocalDatetimeString = (dateObj) => {
  const d = new Date(dateObj)
  if (isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Auto-calculate duration when dates change, but allow user to edit manually
watch([departureDateTime, arrivalDateTime], ([dep, arr]) => {
  if (dep && arr) {
    const depDate = new Date(dep)
    const arrDate = new Date(arr)
    if (!isNaN(depDate.getTime()) && !isNaN(arrDate.getTime())) {
      const diffMins = Math.round((arrDate - depDate) / 60000)
      if (diffMins >= 0) {
        duration.value = diffMins
      }
    }
  }
})

const loadFlight = async () => {
  try {
    const res = await api.get(`/flights/specific/${flightId}`)
    const f = res.data
    flightNumber.value = f.flightNumber || ''
    airline.value = f.airline || ''
    aircraft.value = f.aircraft || ''
    departureAirport.value = f.departureAirport || ''
    arrivalAirport.value = f.arrivalAirport || ''
    
    if (f.departureDateTime) {
      departureDateTime.value = toLocalDatetimeString(f.departureDateTime)
    }
    if (f.arrivalDateTime) {
      arrivalDateTime.value = toLocalDatetimeString(f.arrivalDateTime)
    }

    duration.value = f.duration !== undefined ? f.duration : ''
    basePrice.value = f.basePrice !== undefined ? f.basePrice : ''
    availableSeats.value = f.availableSeats !== undefined ? f.availableSeats : ''
    status.value = f.status || 'scheduled'
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to load flight details.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadFlight()
})

const handleUpdate = async () => {
  errorMessage.value = ''

  if (!flightNumber.value.trim()) {
    errorMessage.value = 'Flight number is required.'
    return
  }
  if (!airline.value.trim()) {
    errorMessage.value = 'Airline is required.'
    return
  }
  if (!aircraft.value.trim()) {
    errorMessage.value = 'Aircraft is required.'
    return
  }
  if (!departureAirport.value.trim()) {
    errorMessage.value = 'Departure airport is required.'
    return
  }
  if (!arrivalAirport.value.trim()) {
    errorMessage.value = 'Arrival airport is required.'
    return
  }
  if (departureAirport.value.trim().toUpperCase() === arrivalAirport.value.trim().toUpperCase()) {
    errorMessage.value = 'Departure airport and arrival airport cannot be the same.'
    return
  }
  if (!departureDateTime.value) {
    errorMessage.value = 'Departure date & time is required.'
    return
  }
  if (!arrivalDateTime.value) {
    errorMessage.value = 'Arrival date & time is required.'
    return
  }
  if (new Date(arrivalDateTime.value) <= new Date(departureDateTime.value)) {
    errorMessage.value = 'Arrival date & time must be after departure date & time.'
    return
  }
  if (duration.value === '' || Number(duration.value) < 0) {
    errorMessage.value = 'Valid duration in minutes is required.'
    return
  }
  if (basePrice.value === '' || Number(basePrice.value) < 0) {
    errorMessage.value = 'Valid base price is required.'
    return
  }
  if (availableSeats.value === '' || Number(availableSeats.value) < 0) {
    errorMessage.value = 'Valid available seats count is required.'
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      flightNumber: flightNumber.value.trim(),
      airline: airline.value.trim(),
      departureAirport: departureAirport.value.trim().toUpperCase(),
      arrivalAirport: arrivalAirport.value.trim().toUpperCase(),
      departureDateTime: departureDateTime.value,
      arrivalDateTime: arrivalDateTime.value,
      duration: Number(duration.value),
      aircraft: aircraft.value.trim(),
      availableSeats: Number(availableSeats.value),
      basePrice: Number(basePrice.value),
      status: status.value || 'scheduled'
    }

    const res = await api.patch(`/flights/${flightId}`, payload)

    notyf.success(res.data?.message || 'Flight updated successfully!')
    router.push('/manage-flights')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to update flight.'
    notyf.error(errorMessage.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="w-100 pt-5 bg-background pb-5 mt-5">
    <div class="max-w-1200 mx-auto px-3 my-4 d-flex flex-column gap-4">
      <div class="position-relative">
        <h1 class="font-display display-5 text-primary mb-2">Edit Flight Schedule</h1>
        <p class="font-body fs-6 text-on-surface-variant mb-0">
          Modify active flight attributes, update pricing, capacity, and operational status.
        </p>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="errorMessage && !flightNumber" class="alert alert-danger my-2">
        {{ errorMessage }}
      </div>

      <form v-else @submit.prevent="handleUpdate" class="w-100 d-flex flex-column gap-4 bg-surface-container-lowest neomorph-outset rounded-4 p-4 p-md-5">
        <div v-if="errorMessage" class="alert alert-danger my-2">
          {{ errorMessage }}
        </div>

        <div class="row g-4">
          <!-- flightNumber -->
          <div class="col-12 col-md-4 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;" for="flightNumber">Flight Number</label>
            <input
              v-model="flightNumber"
              id="flightNumber"
              name="flightNumber"
              class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
              required
              type="text"
            />
          </div>

          <!-- airline -->
          <div class="col-12 col-md-4 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;" for="airline">Airline</label>
            <input
              v-model="airline"
              id="airline"
              name="airline"
              class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
              required
              type="text"
            />
          </div>

          <!-- aircraft -->
          <div class="col-12 col-md-4 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;" for="aircraft">Aircraft</label>
            <input
              v-model="aircraft"
              id="aircraft"
              name="aircraft"
              class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
              required
              type="text"
            />
          </div>

          <div class="col-12 border-top opacity-25 my-1"></div>

          <!-- departureAirport -->
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;" for="departureAirport">Departure Airport / City</label>
            <input
              v-model="departureAirport"
              id="departureAirport"
              name="departureAirport"
              list="airportList"
              class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface text-uppercase"
              required
              type="text"
            />
          </div>

          <!-- arrivalAirport -->
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;" for="arrivalAirport">Arrival Airport / City</label>
            <input
              v-model="arrivalAirport"
              id="arrivalAirport"
              name="arrivalAirport"
              list="airportList"
              class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface text-uppercase"
              required
              type="text"
            />
          </div>

          <datalist id="airportList">
            <option value="MNL">MNL - Manila (Ninoy Aquino International)</option>
            <option value="CEB">CEB - Cebu (Mactan-Cebu International)</option>
            <option value="DVO">DVO - Davao (Francisco Bangoy International)</option>
            <option value="MPH">MPH - Caticlan / Boracay (Godofredo P. Ramos)</option>
            <option value="PPS">PPS - Puerto Princesa / Palawan</option>
            <option value="IAO">IAO - Siargao (Sayak Airport)</option>
            <option value="ILO">ILO - Iloilo International Airport</option>
            <option value="BCD">BCD - Bacolod (Bacolod-Silay Airport)</option>
            <option value="CRK">CRK - Clark / Angeles (Clark International)</option>
            <option value="CGY">CGY - Cagayan de Oro (Laguindingan Airport)</option>
            <option value="TAG">TAG - Bohol / Panglao International</option>
            <option value="ZAM">ZAM - Zamboanga International</option>
            <option value="LGP">LGP - Legazpi / Bicol International</option>
            <option value="GES">GES - General Santos International</option>
            <option value="TAC">TAC - Tacloban (Daniel Z. Romualdez)</option>
            <option value="SIN">SIN - Singapore (Changi Airport)</option>
            <option value="HKG">HKG - Hong Kong International</option>
            <option value="NRT">NRT - Tokyo (Narita International)</option>
            <option value="ICN">ICN - Seoul (Incheon International)</option>
            <option value="DXB">DXB - Dubai International Airport</option>
          </datalist>

          <div class="col-12 border-top opacity-25 my-1"></div>

          <!-- departureDateTime -->
          <div class="col-12 col-md-4 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;" for="departureDateTime">Departure Date & Time</label>
            <input
              v-model="departureDateTime"
              id="departureDateTime"
              name="departureDateTime"
              class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
              required
              type="datetime-local"
            />
          </div>

          <!-- arrivalDateTime -->
          <div class="col-12 col-md-4 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;" for="arrivalDateTime">Arrival Date & Time</label>
            <input
              v-model="arrivalDateTime"
              id="arrivalDateTime"
              name="arrivalDateTime"
              class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
              required
              type="datetime-local"
            />
          </div>

          <!-- duration -->
          <div class="col-12 col-md-4 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;" for="duration">Duration (minutes)</label>
            <input
              v-model="duration"
              id="duration"
              name="duration"
              class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
              placeholder="e.g., 180"
              min="0"
              required
              type="number"
            />
          </div>

          <div class="col-12 border-top opacity-25 my-1"></div>

          <!-- basePrice -->
          <div class="col-12 col-md-4 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;" for="basePrice">Base Price (USD)</label>
            <div class="input-group">
              <span class="input-group-text border-0 neomorph-inset bg-surface-container-lowest rounded-start-3 text-on-surface-variant px-3">$</span>
              <input
                v-model="basePrice"
                id="basePrice"
                name="basePrice"
                class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-end-3 py-2 px-3 font-body text-on-surface"
                min="0"
                required
                step="0.01"
                type="number"
              />
            </div>
          </div>

          <!-- availableSeats -->
          <div class="col-12 col-md-4 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;" for="availableSeats">Available Seats</label>
            <input
              v-model="availableSeats"
              id="availableSeats"
              name="availableSeats"
              class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
              min="0"
              required
              type="number"
            />
          </div>

          <!-- status -->
          <div class="col-12 col-md-4 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;" for="status">Status</label>
            <select
              v-model="status"
              id="status"
              name="status"
              class="form-select border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
              required
            >
              <option value="scheduled">scheduled</option>
              <option value="boarding">boarding</option>
              <option value="departed">departed</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        </div>

        <div class="d-flex align-items-center justify-content-end gap-3 mt-3 pt-3 border-top">
          <button
            @click="router.push('/manage-flights')"
            class="btn border-0 neomorph-outset px-4 py-2 rounded-3 font-headline text-on-surface-variant cursor-pointer"
            type="button"
          >
            Cancel
          </button>
          <button
            :disabled="isSubmitting"
            class="btn border-0 bg-primary text-on-primary neomorph-btn-primary px-4 py-2 rounded-3 font-headline d-flex align-items-center gap-2 cursor-pointer"
            type="submit"
          >
            <span class="material-symbols-outlined" style="font-size: 20px;">save</span>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
