<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/../api'
import notyf from '@/notyf'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const mobile = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleSignup = async () => {
  errorMessage.value = ''
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  isLoading.value = true
  try {
    const res = await api.post('/users/register', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      mobileNo: mobile.value,
      password: password.value
    })
    notyf.success(res.data?.message || 'Registration successful!')
    router.push('/login')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Registration failed.'
    notyf.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="w-100 pt-5 pb-5 min-vh-100 d-flex align-items-center justify-content-center bg-background">
    <div class="d-flex flex-column w-100 align-items-center justify-content-center p-3 position-relative overflow-hidden" style="max-width: 550px;">
      <div class="w-100 bg-surface-container-low rounded-4 p-4 p-md-5 position-relative z-1 neomorph-outset">
        <div class="d-flex flex-column align-items-center mb-4">
          <span
            class="material-symbols-outlined text-primary mb-2"
            style="font-size: 48px; font-variation-settings: 'FILL' 1;"
          >
            flight_takeoff
          </span>
          <h1 class="font-display display-5 text-on-surface mb-1 text-center">
            Join SkyBook
          </h1>
          <p class="font-body text-on-surface-variant text-center mb-0">
            Prepare for your next seamless journey.
          </p>
        </div>

        <div v-if="errorMessage" class="alert alert-danger w-100 py-2 px-3 small rounded-3 mb-3">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSignup" class="d-flex flex-column gap-3">
          <div class="row g-3">
            <div class="col-12 col-md-6 d-flex flex-column gap-1">
              <label class="small text-uppercase text-outline ps-2 fw-bold" style="font-size: 11px;" for="firstName">First Name</label>
              <input
                v-model="firstName"
                id="firstName"
                class="form-control border-0 neomorph-inset bg-surface-container-low rounded-3 py-2 px-3 font-body text-on-surface"
                placeholder="Amelia"
                required
                type="text"
              />
            </div>
            <div class="col-12 col-md-6 d-flex flex-column gap-1">
              <label class="small text-uppercase text-outline ps-2 fw-bold" style="font-size: 11px;" for="lastName">Last Name</label>
              <input
                v-model="lastName"
                id="lastName"
                class="form-control border-0 neomorph-inset bg-surface-container-low rounded-3 py-2 px-3 font-body text-on-surface"
                placeholder="Earhart"
                required
                type="text"
              />
            </div>
          </div>

          <div class="d-flex flex-column gap-1">
            <label class="small text-uppercase text-outline ps-2 fw-bold" style="font-size: 11px;" for="email">Email Address</label>
            <input
              v-model="email"
              id="email"
              class="form-control border-0 neomorph-inset bg-surface-container-low rounded-3 py-2 px-3 font-body text-on-surface"
              placeholder="traveler@skybook.com"
              required
              type="email"
            />
          </div>

          <div class="d-flex flex-column gap-1">
            <label class="small text-uppercase text-outline ps-2 fw-bold" style="font-size: 11px;" for="mobile">Mobile Number</label>
            <input
              v-model="mobile"
              id="mobile"
              class="form-control border-0 neomorph-inset bg-surface-container-low rounded-3 py-2 px-3 font-body text-on-surface"
              placeholder="+1 (555) 012-3456"
              required
              type="tel"
            />
          </div>

          <div class="row g-3">
            <div class="col-12 col-md-6 d-flex flex-column gap-1">
              <label class="small text-uppercase text-outline ps-2 fw-bold" style="font-size: 11px;" for="password">Password</label>
              <input
                v-model="password"
                id="password"
                class="form-control border-0 neomorph-inset bg-surface-container-low rounded-3 py-2 px-3 font-body text-on-surface"
                placeholder="••••••••"
                required
                type="password"
              />
            </div>
            <div class="col-12 col-md-6 d-flex flex-column gap-1">
              <label class="small text-uppercase text-outline ps-2 fw-bold" style="font-size: 11px;" for="confirmPassword">Confirm Password</label>
              <input
                v-model="confirmPassword"
                id="confirmPassword"
                class="form-control border-0 neomorph-inset bg-surface-container-low rounded-3 py-2 px-3 font-body text-on-surface"
                placeholder="••••••••"
                required
                type="password"
              />
            </div>
          </div>

          <button
            class="btn border-0 mt-3 w-100 bg-primary text-on-primary font-headline fs-5 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 neomorph-btn-primary cursor-pointer"
            type="submit"
          >
            <span>Create Account</span>
            <span class="material-symbols-outlined" style="font-size: 20px;">arrow_forward</span>
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="small text-on-surface-variant mb-0">
            Already have an account?
            <router-link to="/login" class="text-primary font-headline small text-decoration-none border-bottom border-primary hover-primary ms-1">Log In</router-link>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.hover-primary:hover {
  color: var(--primary) !important;
}
</style>
