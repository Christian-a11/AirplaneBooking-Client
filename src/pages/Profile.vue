<script setup>
import { ref, onMounted } from 'vue'
import api from '@/../api'
import { useGlobalStore } from '@/stores/global'
import notyf from '@/notyf'

const globalStore = useGlobalStore()

const firstName = ref('')
const lastName = ref('')
const mobileNo = ref('')
const email = ref('')

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const loadProfile = async () => {
  try {
    const res = await api.get('/users/details')
    firstName.value = res.data.firstName || ''
    lastName.value = res.data.lastName || ''
    mobileNo.value = res.data.mobileNo || ''
    email.value = res.data.email || ''
  } catch (err) {
    errorMessage.value = 'Failed to load profile details.'
  }
}

onMounted(() => {
  loadProfile()
})

const handleUpdateProfile = async () => {
  isSubmitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const res = await api.patch('/users/details', {
      firstName: firstName.value,
      lastName: lastName.value,
      mobileNo: mobileNo.value
    })

    successMessage.value = res.data.message || 'Profile updated successfully!'
    notyf.success(successMessage.value)
    
    // Update global store state
    if (globalStore.user.token) {
      await globalStore.setUserDetails(globalStore.user.token)
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to update profile.'
    notyf.error(errorMessage.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="w-100 pt-5 bg-background pb-5 mt-5">
    <div class="max-w-800 mx-auto px-3 my-4 d-flex flex-column gap-4">
      <div class="d-flex flex-column gap-2">
        <h1 class="font-display display-5 text-primary mb-0">Account Profile</h1>
        <p class="font-body fs-6 text-on-surface-variant mb-0">
          View and update your personal contact details.
        </p>
      </div>

      <div v-if="successMessage" class="alert alert-success rounded-3">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="alert alert-danger rounded-3">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleUpdateProfile" class="neomorph-outset bg-surface p-4 p-md-5 rounded-4 d-flex flex-column gap-4">
        <div class="d-flex align-items-center gap-3 mb-2">
          <div class="rounded-circle neomorph-inset d-flex align-items-center justify-content-center text-primary" style="width: 56px; height: 56px;">
            <span class="material-symbols-outlined display-6">person</span>
          </div>
          <div>
            <h2 class="font-headline fs-5 text-on-surface mb-0">{{ firstName }} {{ lastName }}</h2>
            <span class="small text-on-surface-variant">{{ email }}</span>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;">First Name</label>
            <input
              v-model="firstName"
              class="form-control border-0 neomorph-inset bg-surface rounded-3 py-2 px-3 font-body text-on-surface"
              required
              type="text"
            />
          </div>

          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;">Last Name</label>
            <input
              v-model="lastName"
              class="form-control border-0 neomorph-inset bg-surface rounded-3 py-2 px-3 font-body text-on-surface"
              required
              type="text"
            />
          </div>

          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;">Mobile Number</label>
            <input
              v-model="mobileNo"
              class="form-control border-0 neomorph-inset bg-surface rounded-3 py-2 px-3 font-body text-on-surface"
              required
              type="tel"
            />
          </div>

          <div class="col-12 col-md-6 d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;">Email Address (Read Only)</label>
            <input
              :value="email"
              disabled
              class="form-control border-0 neomorph-inset bg-surface-container-high rounded-3 py-2 px-3 font-body text-on-surface-variant opacity-75"
              type="email"
            />
          </div>
        </div>

        <div class="d-flex justify-content-end mt-3 pt-3 border-top">
          <button
            :disabled="isSubmitting"
            type="submit"
            class="btn border-0 bg-primary text-on-primary neomorph-btn-primary px-4 py-2 rounded-3 font-headline d-flex align-items-center gap-2 cursor-pointer"
          >
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm"></span>
            <span v-else class="material-symbols-outlined" style="font-size: 18px;">save</span>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
