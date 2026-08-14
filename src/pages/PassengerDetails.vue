<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/../api'
import { useGlobalStore } from '@/stores/global'
import notyf from '@/notyf'

const router = useRouter()
const route = useRoute()
const globalStore = useGlobalStore()

const flightId = route.query.flightId
const flight = ref(null)
const isLoadingFlight = ref(true)
const errorMessage = ref('')

const passengersList = ref([
  {
    firstName: globalStore.user.firstName || '',
    lastName: globalStore.user.lastName || '',
    dob: '',
    gender: '',
    nationality: 'us',
    passport: ''
  }
])

const addPassenger = () => {
  passengersList.value.push({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    nationality: 'us',
    passport: ''
  })
}

const removePassenger = (idx) => {
  if (passengersList.value.length > 1) {
    passengersList.value.splice(idx, 1)
  }
}

const totalBookingPrice = computed(() => {
  if (!flight.value) return 0
  return flight.value.basePrice * passengersList.value.length
})

const email = ref(globalStore.user.email || '')
const phone = ref(globalStore.user.mobileNo || '')
const paymentMethod = ref('card')

const isSubmitting = ref(false)

const loadFlightDetails = async () => {
  if (!flightId) {
    errorMessage.value = "No flight selected."
    isLoadingFlight.value = false
    return
  }
  try {
    const res = await api.get(`/flights/specific/${flightId}`)
    flight.value = res.data
  } catch (err) {
    errorMessage.value = "Failed to load flight information."
  } finally {
    isLoadingFlight.value = false
  }
}

onMounted(() => {
  loadFlightDetails()
})

const handleContinue = async () => {
  if (!globalStore.user.token) {
    router.push('/login')
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const genderMap = { f: 'Female', m: 'Male', u: 'Other', Female: 'Female', Male: 'Male', Other: 'Other' }

    const passengersPayload = passengersList.value.map(p => ({
      firstName: p.firstName,
      lastName: p.lastName,
      dateOfBirth: p.dob ? new Date(p.dob).toISOString() : new Date().toISOString(),
      gender: genderMap[p.gender] || 'Other',
      nationality: p.nationality || 'us',
      passportNumber: p.passport || 'N/A'
    }))

    // 1. Create Booking
    const bookingRes = await api.post('/bookings/create', {
      flightId: flight.value._id,
      passengers: passengersPayload
    })

    const bookingId = bookingRes.data.booking._id

    // 2. Create Payment
    await api.post('/payments/create', {
      bookingId,
      paymentMethod: paymentMethod.value
    })

    notyf.success('Booking and Payment successfully confirmed!')

    router.push({
      path: '/booking-confirmed',
      query: { bookingId }
    })
  } catch (err) {
    errorMessage.value = err.response?.data?.message || "Failed to process booking."
    notyf.error(errorMessage.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="w-100 pt-5 bg-background pb-5 mt-5">
    <div class="max-w-1200 mx-auto px-3 my-4">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-2">
        <div class="d-flex flex-column">
          <p class="small text-uppercase text-primary tracking-widest mb-1 font-headline">
            Step 2 of 3
          </p>
          <h1 class="font-display display-5 text-on-background mb-0">
            Passenger Details
          </h1>
        </div>
        <div class="d-flex align-items-center gap-2">
          <div class="rounded-circle neomorph-inset d-flex align-items-center justify-content-center text-primary" style="width: 40px; height: 40px;">
            <span class="material-symbols-outlined" style="font-size: 20px;">person</span>
          </div>
          <div class="rounded-circle neomorph-inset d-flex align-items-center justify-content-center text-outline-variant" style="width: 40px; height: 40px;">
            <span class="material-symbols-outlined" style="font-size: 20px;">luggage</span>
          </div>
          <div class="rounded-circle neomorph-inset d-flex align-items-center justify-content-center text-outline-variant" style="width: 40px; height: 40px;">
            <span class="material-symbols-outlined" style="font-size: 20px;">payment</span>
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="alert alert-danger my-3">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleContinue" id="passenger-form">
        <div class="row g-4">
          <div class="col-12 col-lg-8 d-flex flex-column gap-4">
            
            <!-- Passenger Forms List -->
            <div
              v-for="(p, index) in passengersList"
              :key="index"
              class="neomorph-outset rounded-4 p-4 bg-surface-container-lowest position-relative"
            >
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center gap-2">
                  <span
                    class="material-symbols-outlined text-secondary"
                    style="font-size: 24px; font-variation-settings: 'FILL' 1"
                    >face</span
                  >
                  <h2 class="font-headline fs-5 text-on-surface mb-0">
                    Passenger {{ index + 1 }} {{ index === 0 ? '(Primary Contact)' : '' }}
                  </h2>
                </div>
                <button
                  v-if="passengersList.length > 1"
                  @click="removePassenger(index)"
                  type="button"
                  class="btn btn-sm btn-outline-danger border-0 d-flex align-items-center gap-1 cursor-pointer"
                >
                  <span class="material-symbols-outlined fs-6">delete</span>
                  Remove
                </button>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-12 col-md-6 d-flex flex-column gap-1">
                  <label class="small text-on-surface-variant ps-2">First Name (as on ID)</label>
                  <input
                    v-model="p.firstName"
                    class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
                    placeholder="e.g. Jane"
                    required
                    type="text"
                  />
                </div>
                <div class="col-12 col-md-6 d-flex flex-column gap-1">
                  <label class="small text-on-surface-variant ps-2">Last Name</label>
                  <input
                    v-model="p.lastName"
                    class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
                    placeholder="e.g. Doe"
                    required
                    type="text"
                  />
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-12 col-md-4 d-flex flex-column gap-1">
                  <label class="small text-on-surface-variant ps-2">Date of Birth</label>
                  <input
                    v-model="p.dob"
                    class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
                    required
                    type="date"
                  />
                </div>
                <div class="col-12 col-md-4 d-flex flex-column gap-1">
                  <label class="small text-on-surface-variant ps-2">Gender</label>
                  <select
                    v-model="p.gender"
                    class="form-select border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
                    required
                  >
                    <option disabled value="">Select</option>
                    <option value="f">Female</option>
                    <option value="m">Male</option>
                    <option value="u">Unspecified</option>
                  </select>
                </div>
                <div class="col-12 col-md-4 d-flex flex-column gap-1">
                  <label class="small text-on-surface-variant ps-2">Nationality</label>
                  <select
                    v-model="p.nationality"
                    class="form-select border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
                    required
                  >
                    <option disabled value="">Select</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                  </select>
                </div>
              </div>

              <div class="row g-3">
                <div class="col-12 col-md-6 d-flex flex-column gap-1">
                  <label class="small text-on-surface-variant ps-2">Passport Number</label>
                  <input
                    v-model="p.passport"
                    class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface text-uppercase"
                    placeholder="Optional for domestic"
                    type="text"
                  />
                </div>
              </div>
            </div>

            <!-- Add Passenger Button -->
            <button
              @click="addPassenger"
              type="button"
              class="btn border-0 neomorph-outset bg-surface text-primary rounded-3 font-headline py-3 d-flex align-items-center justify-content-center gap-2 cursor-pointer w-100"
            >
              <span class="material-symbols-outlined">person_add</span>
              + Add Another Passenger
            </button>

            <!-- Contact Information -->
            <div class="neomorph-outset rounded-4 p-4 bg-surface-container-lowest">
              <div class="d-flex align-items-center gap-2 mb-3">
                <span
                  class="material-symbols-outlined text-secondary"
                  style="font-size: 24px; font-variation-settings: 'FILL' 1"
                  >contact_mail</span
                >
                <h2 class="font-headline fs-5 text-on-surface mb-0">
                  Contact Information
                </h2>
              </div>
              <div class="row g-3">
                <div class="col-12 col-md-6 d-flex flex-column gap-1">
                  <label class="small text-on-surface-variant ps-2">Email Address</label>
                  <input
                    v-model="email"
                    class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-3 py-2 px-3 font-body text-on-surface"
                    placeholder="Confirmation will be sent here"
                    required
                    type="email"
                  />
                </div>
                <div class="col-12 col-md-6 d-flex flex-column gap-1">
                  <label class="small text-on-surface-variant ps-2">Phone Number</label>
                  <div class="input-group">
                    <span class="input-group-text border-0 neomorph-inset bg-surface-container-lowest rounded-start-3 text-on-surface px-3" style="width: 60px;">+1</span>
                    <input
                      v-model="phone"
                      class="form-control border-0 neomorph-inset bg-surface-container-lowest rounded-end-3 py-2 px-3 font-body text-on-surface"
                      placeholder="(555) 000-0000"
                      required
                      type="tel"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Method Section -->
            <div class="neomorph-outset rounded-4 p-4 bg-surface-container-lowest">
              <div class="d-flex align-items-center gap-2 mb-3">
                <span
                  class="material-symbols-outlined text-primary"
                  style="font-size: 24px; font-variation-settings: 'FILL' 1"
                  >payments</span
                >
                <h2 class="font-headline fs-5 text-on-surface mb-0">
                  Payment Method
                </h2>
              </div>
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="d-flex align-items-center gap-3 p-3 rounded-3 neomorph-inset cursor-pointer w-100">
                    <input
                      type="radio"
                      v-model="paymentMethod"
                      value="card"
                    />
                    <div class="d-flex align-items-center gap-2">
                      <span class="material-symbols-outlined text-primary">credit_card</span>
                      <span class="font-headline small text-on-surface">Credit / Debit Card</span>
                    </div>
                  </label>
                </div>

                <div class="col-12 col-md-6">
                  <label class="d-flex align-items-center gap-3 p-3 rounded-3 neomorph-inset cursor-pointer w-100">
                    <input
                      type="radio"
                      v-model="paymentMethod"
                      value="paypal"
                    />
                    <div class="d-flex align-items-center gap-2">
                      <span class="material-symbols-outlined text-primary">account_balance_wallet</span>
                      <span class="font-headline small text-on-surface">E-Wallet / PayPal</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-2">
              <button
                @click="router.push('/search-results')"
                class="btn border-0 neomorph-btn-primary bg-surface-container-lowest text-on-surface-variant px-4 py-2 rounded-3 font-headline d-flex align-items-center gap-2 cursor-pointer"
                type="button"
              >
                <span class="material-symbols-outlined" style="font-size: 20px;">arrow_back</span>
                Back
              </button>
              <button
                :disabled="isSubmitting"
                class="btn border-0 neomorph-btn-primary bg-primary text-on-primary px-4 py-2 rounded-3 font-headline d-flex align-items-center gap-2 cursor-pointer"
                type="submit"
              >
                <span v-if="isSubmitting" class="d-flex align-items-center gap-2">
                  <span class="spinner-border spinner-border-sm"></span>
                  Processing...
                </span>
                <span v-else class="d-flex align-items-center gap-2">
                  Confirm & Pay (${{ totalBookingPrice }})
                  <span class="material-symbols-outlined" style="font-size: 20px;">arrow_forward</span>
                </span>
              </button>
            </div>
          </div>

          <!-- Flight Summary Sidebar -->
          <aside class="col-12 col-lg-4">
            <div v-if="flight" class="neomorph-outset rounded-4 p-4 bg-surface-container-lowest sticky-top" style="top: 100px;">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <h3 class="font-headline fs-5 text-on-surface mb-0">
                  Flight Summary
                </h3>
                <span class="badge bg-primary-container text-on-primary-container rounded-pill px-3 py-1"
                  >{{ flight.flightNumber }}</span
                >
              </div>
              <div class="d-flex flex-column gap-1 mb-3 text-center">
                <div class="d-flex justify-content-between align-items-center px-2">
                  <span class="font-headline fs-3 text-primary">{{ flight.departureAirport }}</span>
                  <div class="flex-grow-1 mx-3 position-relative d-flex align-items-center justify-content-center">
                    <div class="w-100 border-top border-primary opacity-25"></div>
                    <span class="material-symbols-outlined position-absolute text-secondary bg-surface-container-lowest px-1" style="font-size: 20px; transform: rotate(90deg);"
                      >flight</span
                    >
                  </div>
                  <span class="font-headline fs-3 text-primary">{{ flight.arrivalAirport }}</span>
                </div>
                <p class="small text-on-surface-variant mb-0">
                  {{ flight.airline }} • {{ flight.duration }} mins
                </p>
              </div>
              <div class="border-top my-3 opacity-25"></div>
              <div class="d-flex flex-column gap-2">
                <div class="d-flex justify-content-between align-items-end">
                  <span class="small text-on-surface-variant">{{ passengersList.length }}x Adult Ticket(s)</span>
                  <span class="font-headline text-on-surface">${{ flight.basePrice }} ea.</span>
                </div>
              </div>
              <div class="border-top my-3 opacity-25"></div>
              <div class="d-flex justify-content-between align-items-end">
                <span class="font-headline fs-5 text-on-surface">Total</span>
                <span class="font-display fs-3 text-primary">${{ totalBookingPrice }}</span>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  </main>
</template>

