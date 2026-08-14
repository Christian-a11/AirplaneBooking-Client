<script setup>
import { ref, onMounted } from 'vue'
import api from '@/../api'
import notyf from '@/notyf'

const bookings = ref([])
const paymentsMap = ref({})
const passengersMap = ref({})
const selectedBookingPassengers = ref([])
const selectedBookingRef = ref('')
const isLoading = ref(true)
const errorMessage = ref('')

const fetchAllBookings = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await api.get('/bookings/all')
    bookings.value = res.data || []
    
    // Fetch associated payment for each booking
    for (const b of bookings.value) {
      try {
        const payRes = await api.get(`/payments/booking/${b._id}`)
        paymentsMap.value[b._id] = payRes.data
      } catch (e) {}
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to load bookings.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAllBookings()
})

const updateStatus = async (bookingId, status) => {
  try {
    const res = await api.patch(`/bookings/status/${bookingId}`, { bookingStatus: status })
    notyf.success(res.data?.message || 'Booking status updated!')
    await fetchAllBookings()
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Failed to update booking status.')
  }
}

const updatePaymentStatus = async (paymentId, status) => {
  if (!paymentId) return
  try {
    const res = await api.patch(`/payments/${paymentId}/status`, { paymentStatus: status })
    notyf.success(res.data?.message || 'Payment status updated!')
    await fetchAllBookings()
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Failed to update payment status.')
  }
}

const selectedPaymentDetails = ref(null)

const viewPaymentDetails = async (paymentId) => {
  if (!paymentId) return
  selectedPaymentDetails.value = null
  try {
    const res = await api.get(`/payments/${paymentId}`)
    selectedPaymentDetails.value = res.data
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Failed to load payment details.')
  }
}

const viewPassengers = async (booking) => {
  selectedBookingRef.value = booking.bookingRef
  try {
    const res = await api.get(`/passengers/booking/${booking._id}`)
    selectedBookingPassengers.value = res.data || []
  } catch (err) {
    selectedBookingPassengers.value = []
  }
}

const formatDate = (dt) => {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString()
}
</script>

<template>
  <main class="w-100 pt-5 bg-background pb-5 mt-5">
    <div class="max-w-1400 mx-auto px-3 my-4 d-flex flex-column gap-4">
      <div class="d-flex flex-column gap-2">
        <h1 class="font-display display-5 text-primary mb-0">System Bookings</h1>
        <p class="font-body fs-6 text-on-surface-variant mb-0">
          Admin dashboard for reviewing and updating status of all reservations across the airline network.
        </p>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <div v-else class="neomorph-outset bg-surface p-4 rounded-4">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 text-on-surface">
            <thead>
              <tr class="text-uppercase small text-on-surface-variant">
                <th>Ref</th>
                <th>Passenger / User</th>
                <th>Route</th>
                <th>Total</th>
                <th>Booking Status</th>
                <th>Payment Status</th>
                <th class="text-end">Txn Ref</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in bookings" :key="b._id">
                <td class="fw-bold">#{{ b.bookingRef }}</td>
                <td>
                  <div>{{ b.userId?.email || 'Guest' }}</div>
                  <button
                    @click="viewPassengers(b)"
                    data-bs-toggle="modal"
                    data-bs-target="#passengersModal"
                    class="btn btn-link btn-sm p-0 text-primary small text-decoration-none"
                  >
                    View Passengers ({{ b.passengerCount }})
                  </button>
                </td>
                <td>{{ b.flightId?.departureAirport }} → {{ b.flightId?.arrivalAirport }}</td>
                <td class="fw-bold text-primary">${{ b.totalPrice }}</td>
                <td>
                  <select
                    :value="b.bookingStatus"
                    @change="updateStatus(b._id, $event.target.value)"
                    class="form-select form-select-sm border-0 neomorph-inset bg-surface rounded-3 px-2 py-1"
                    style="width: 130px;"
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">cancelled</option>
                    <option value="completed">completed</option>
                  </select>
                </td>
                <td>
                  <select
                    v-if="paymentsMap[b._id]"
                    :value="paymentsMap[b._id]?.paymentStatus"
                    @change="updatePaymentStatus(paymentsMap[b._id]._id, $event.target.value)"
                    class="form-select form-select-sm border-0 neomorph-inset bg-surface rounded-3 px-2 py-1"
                    style="width: 130px;"
                  >
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="failed">failed</option>
                    <option value="refunded">refunded</option>
                  </select>
                  <span v-else class="small text-on-surface-variant">No Payment</span>
                </td>
                <td class="text-end">
                  <button
                    v-if="paymentsMap[b._id]?._id"
                    @click="viewPaymentDetails(paymentsMap[b._id]._id)"
                    data-bs-toggle="modal"
                    data-bs-target="#paymentModal"
                    class="btn btn-link btn-sm p-0 text-primary small text-decoration-none fw-bold"
                  >
                    {{ paymentsMap[b._id]?.transactionReference }}
                  </button>
                  <span v-else class="small text-on-surface-variant">N/A</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Passengers Modal -->
      <div class="modal fade" id="passengersModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 neomorph-outset bg-surface text-on-surface rounded-4">
            <div class="modal-header border-bottom">
              <h5 class="modal-title font-headline">Passengers for #{{ selectedBookingRef }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div v-if="selectedBookingPassengers.length === 0" class="text-center py-3 text-on-surface-variant">
                No passenger details found.
              </div>
              <ul v-else class="list-group list-group-flush bg-transparent">
                <li v-for="p in selectedBookingPassengers" :key="p._id" class="list-group-item bg-transparent text-on-surface border-bottom">
                  <div class="fw-bold">{{ p.firstName }} {{ p.lastName }}</div>
                  <div class="small text-on-surface-variant">
                    Gender: {{ p.gender }} | DOB: {{ formatDate(p.dateOfBirth) }} | Passport: {{ p.passportNumber }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Details Modal -->
      <div class="modal fade" id="paymentModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 neomorph-outset bg-surface text-on-surface rounded-4">
            <div class="modal-header border-bottom">
              <h5 class="modal-title font-headline">Transaction Receipt Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div v-if="!selectedPaymentDetails" class="text-center py-3 text-on-surface-variant">
                Loading transaction details...
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <div class="d-flex justify-content-between">
                  <span class="text-on-surface-variant">Transaction Ref:</span>
                  <span class="fw-bold text-primary">{{ selectedPaymentDetails.transactionReference }}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-on-surface-variant">Payment Method:</span>
                  <span class="text-uppercase fw-bold">{{ selectedPaymentDetails.paymentMethod }}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-on-surface-variant">Amount Paid:</span>
                  <span class="fw-bold text-success">${{ selectedPaymentDetails.amount }}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-on-surface-variant">Status:</span>
                  <span class="badge bg-secondary text-uppercase">{{ selectedPaymentDetails.paymentStatus }}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-on-surface-variant">Date:</span>
                  <span>{{ formatDate(selectedPaymentDetails.createdAt || selectedPaymentDetails.paymentDate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
