<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/../api'
import { useGlobalStore } from '@/stores/global'
import notyf from '@/notyf'

const router = useRouter()
const globalStore = useGlobalStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true
  try {
    const res = await api.post('/users/login', {
      email: email.value,
      password: password.value
    })
    
    if (res.data && res.data.access) {
      await globalStore.setUserDetails(res.data.access)
      notyf.success(res.data.message || 'Login successful!')
      router.push('/')
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Login failed. Please check your credentials.'
    notyf.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="w-100 pt-5 pb-5 min-vh-100 d-flex align-items-center justify-content-center bg-background">
    <div class="d-flex flex-column w-100 max-w-400 align-items-center justify-content-center p-3 position-relative overflow-hidden">
      <div
        class="position-relative w-100 bg-surface rounded-5 p-4 p-md-5 d-flex flex-column align-items-center z-1 neomorph-outset"
        style="max-width: 420px;"
      >
        <div
          class="rounded-circle bg-surface neomorph-inset d-flex align-items-center justify-content-center text-primary mb-3"
          style="width: 64px; height: 64px;"
        >
          <span class="material-symbols-outlined display-6" style="font-variation-settings: 'FILL' 1">flight_takeoff</span>
        </div>

        <h1 class="font-display display-5 text-on-surface mb-1 text-center">
          SkyBook
        </h1>
        <p class="font-body text-on-surface-variant mb-4 text-center">
          Your journey begins here.
        </p>

        <div v-if="errorMessage" class="alert alert-danger w-100 py-2 px-3 small rounded-3 mb-3">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="w-100 d-flex flex-column gap-3">
          <div class="d-flex flex-column gap-1">
            <label class="small text-uppercase text-on-surface-variant ps-2 fw-bold" style="font-size: 11px;" for="email">Email Address</label>
            <div class="input-group">
              <span class="input-group-text border-0 neomorph-inset bg-surface rounded-start-3 text-on-surface-variant px-3">
                <span class="material-symbols-outlined" style="font-size: 20px;">mail</span>
              </span>
              <input
                v-model="email"
                id="email"
                class="form-control border-0 neomorph-inset bg-surface rounded-end-3 py-2 px-3 font-body text-on-surface"
                placeholder="name@example.com"
                required
                type="email"
              />
            </div>
          </div>

          <div class="d-flex flex-column gap-1">
            <div class="d-flex justify-content-between align-items-center px-1">
              <label class="small text-uppercase text-on-surface-variant fw-bold" style="font-size: 11px;" for="password">Password</label>
              <a class="small text-primary text-decoration-none hover-primary cursor-pointer">Forgot?</a>
            </div>
            <div class="input-group">
              <span class="input-group-text border-0 neomorph-inset bg-surface rounded-start-3 text-on-surface-variant px-3">
                <span class="material-symbols-outlined" style="font-size: 20px;">lock</span>
              </span>
              <input
                v-model="password"
                id="password"
                class="form-control border-0 neomorph-inset bg-surface py-2 px-3 font-body text-on-surface"
                placeholder="••••••••"
                required
                :type="showPassword ? 'text' : 'password'"
              />
              <button
                @click="showPassword = !showPassword"
                class="btn border-0 neomorph-inset bg-surface rounded-end-3 text-on-surface-variant px-3 d-flex align-items-center cursor-pointer"
                type="button"
              >
                <span class="material-symbols-outlined" style="font-size: 20px;">{{ showPassword ? 'visibility' : 'visibility_off' }}</span>
              </button>
            </div>
          </div>

          <button
            class="btn border-0 mt-3 w-100 bg-primary text-on-primary font-headline fs-5 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 neomorph-btn-primary cursor-pointer"
            type="submit"
          >
            Log In
            <span class="material-symbols-outlined" style="font-size: 20px;">arrow_forward</span>
          </button>
        </form>

        <div class="mt-4 d-flex align-items-center justify-content-center gap-1">
          <span class="small text-on-surface-variant">Don't have an account?</span>
          <router-link to="/signup" class="small font-headline text-primary text-decoration-none hover-primary">Sign Up</router-link>
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
