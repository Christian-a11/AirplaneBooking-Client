<script setup>
import { ref, onMounted } from 'vue'
import api from '@/../api'

const activeFaq = ref(null)
const aboutData = ref(null)

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

onMounted(async () => {
  try {
    const res = await api.get('/about')
    aboutData.value = res.data
  } catch (e) {
    // fallback if any
  }
})
</script>

<template>
  <main class="w-100 pt-5 bg-background pb-5 mt-5">
    <div class="max-w-1200 mx-auto px-3 my-4 d-flex flex-column gap-5">
      <!-- Vision & Mission -->
      <section class="d-flex flex-column gap-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-end gap-3">
          <div class="d-flex flex-column gap-1" style="max-width: 650px;">
            <p class="small text-uppercase text-primary tracking-widest mb-1 font-headline">
              The SkyBook Vision
            </p>
            <h1 class="font-display display-5 text-on-background mb-0">
              Elevating the Journey.
            </h1>
          </div>
        </div>

        <div class="row g-4 position-relative">
          <div class="col-12 col-md-8">
            <div class="rounded-5 neomorph-outset overflow-hidden position-relative" style="height: 500px;">
              <div
                class="bg-cover bg-center w-100 h-100 position-absolute top-0 start-0"
                style="
                  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPo8MeJPJKHGMBPYS9BS93BJIgvHeGhdDT3bpBKDylFgwrSfCDHFW_PSb4BcZUx8SnVND2E5uZs0OfGDPdgIPopnCh3_PCBsFr8yE6uCYy_zXaRfdDGz4whKOexiBu7UN4f4xIUsPoQJxIKpqZvHtWpf6B9aPINTuRJQU_-kJ7oirj2cK5CRxBkevr5UYdllU6krOT9OBVJMRxZASQidJxGcVynTYeLaf6LKish46bDTx1WwBs2TEPxchOFugKRIuBbW7P-EGXqeE');
                  background-size: cover;
                  background-position: center;
                "
              ></div>
              <div class="position-absolute inset-0 bg-gradient-to-t"></div>
              <div class="position-absolute bottom-0 start-0 end-0 m-4 neomorph-outset bg-background bg-opacity-75 backdrop-blur p-4 rounded-4">
                <h2 class="font-headline fs-5 text-on-background mb-2">Our Mission</h2>
                <p class="font-body text-on-surface-variant mb-0">
                  At SkyBook, we believe the journey should be as effortless as the destination. We are committed to stripping away the friction of modern travel, replacing it with intuitive design, transparent pricing, and unparalleled support.
                </p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4 d-flex flex-column gap-4">
            <div class="neomorph-outset rounded-5 p-4 d-flex flex-column align-items-center justify-content-center text-center h-100 gap-2">
              <div class="rounded-circle neomorph-inset d-flex align-items-center justify-content-center mb-2 text-primary" style="width: 64px; height: 64px;">
                <span class="material-symbols-outlined" style="font-size: 32px; font-variation-settings: 'FILL' 1;">public</span>
              </div>
              <h3 class="font-headline fs-5 text-on-background mb-1">Global Reach</h3>
              <p class="small text-on-surface-variant mb-0">
                Connecting you to over 200 destinations worldwide with seamless transfers.
              </p>
            </div>

            <div class="neomorph-outset rounded-5 p-4 d-flex flex-column align-items-center justify-content-center text-center h-100 gap-2">
              <div class="rounded-circle neomorph-inset d-flex align-items-center justify-content-center mb-2 text-primary" style="width: 64px; height: 64px;">
                <span class="material-symbols-outlined" style="font-size: 32px; font-variation-settings: 'FILL' 1;">eco</span>
              </div>
              <h3 class="font-headline fs-5 text-on-background mb-1">Sustainable Sky</h3>
              <p class="small text-on-surface-variant mb-0">
                Pioneering carbon-offset programs and efficient routing for a greener tomorrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Customer Support -->
      <section class="d-flex flex-column gap-4">
        <div class="d-flex flex-column gap-1">
          <p class="small text-uppercase text-primary tracking-widest mb-1 font-headline">We're Here For You</p>
          <h2 class="font-display fs-2 text-on-background mb-0">Customer Support</h2>
        </div>

        <div class="row g-4">
          <div class="col-12 col-md-4">
            <div class="neomorph-outset rounded-4 p-4 d-flex flex-column gap-3 card-hover transition-all">
              <div class="rounded-circle neomorph-outset d-flex align-items-center justify-content-center text-primary" style="width: 48px; height: 48px;">
                <span class="material-symbols-outlined">call</span>
              </div>
              <div>
                <h3 class="font-headline fs-5 text-on-background mb-1">Reservations</h3>
                <p class="small text-on-surface-variant mb-2">24/7 Booking Assistance</p>
                <a href="tel:+18005550199" class="font-headline text-primary text-decoration-none hover-primary">+1 (800) 555-0199</a>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="neomorph-outset rounded-4 p-4 d-flex flex-column gap-3 card-hover transition-all">
              <div class="rounded-circle neomorph-outset d-flex align-items-center justify-content-center text-primary" style="width: 48px; height: 48px;">
                <span class="material-symbols-outlined">mail</span>
              </div>
              <div>
                <h3 class="font-headline fs-5 text-on-background mb-1">Email Support</h3>
                <p class="small text-on-surface-variant mb-2">General Inquiries & Feedback</p>
                <a href="mailto:support@skybook.com" class="font-headline text-primary text-decoration-none hover-primary">support@skybook.com</a>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="neomorph-outset rounded-4 p-4 d-flex flex-column gap-3 card-hover transition-all">
              <div class="rounded-circle neomorph-outset d-flex align-items-center justify-content-center text-primary" style="width: 48px; height: 48px;">
                <span class="material-symbols-outlined">luggage</span>
              </div>
              <div>
                <h3 class="font-headline fs-5 text-on-background mb-1">Baggage Claim</h3>
                <p class="small text-on-surface-variant mb-2">Lost or Delayed Items</p>
                <a href="tel:+18005550200" class="font-headline text-primary text-decoration-none hover-primary">+1 (800) 555-0200</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="d-flex flex-column gap-4 mx-auto w-100" style="max-width: 800px;">
        <div class="text-center d-flex flex-column gap-1">
          <h2 class="font-display fs-2 text-on-background mb-1">Frequently Asked Questions</h2>
          <p class="font-body fs-6 text-on-surface-variant mb-0">Find quick answers to common travel queries.</p>
        </div>

        <div class="d-flex flex-column gap-3">
          <!-- FAQ Item 1 -->
          <div
            :class="activeFaq === 0 ? 'neomorph-inset' : 'neomorph-outset'"
            class="rounded-3 overflow-hidden transition-all"
          >
            <button
              @click="toggleFaq(0)"
              class="btn border-0 w-100 px-4 py-3 d-flex justify-content-between align-items-center bg-transparent text-start cursor-pointer"
            >
              <span class="font-headline fs-6 text-on-background mb-0">How do I change my flight?</span>
              <span
                :class="{ 'rotate-180': activeFaq === 0 }"
                class="material-symbols-outlined text-outline transition-all"
                >expand_more</span
              >
            </button>
            <div v-if="activeFaq === 0" class="px-4 pb-3">
              <div class="neomorph-inset rounded-3 p-3 bg-background">
                <p class="small text-on-surface-variant mb-0">
                  You can change your flight by navigating to the "Manage Bookings" section. Enter your confirmation code and last name to view your itinerary. Select "Modify Flight" and follow the prompts.
                </p>
              </div>
            </div>
          </div>

          <!-- FAQ Item 2 -->
          <div
            :class="activeFaq === 1 ? 'neomorph-inset' : 'neomorph-outset'"
            class="rounded-3 overflow-hidden transition-all"
          >
            <button
              @click="toggleFaq(1)"
              class="btn border-0 w-100 px-4 py-3 d-flex justify-content-between align-items-center bg-transparent text-start cursor-pointer"
            >
              <span class="font-headline fs-6 text-on-background mb-0">What is the baggage allowance?</span>
              <span
                :class="{ 'rotate-180': activeFaq === 1 }"
                class="material-symbols-outlined text-outline transition-all"
                >expand_more</span
              >
            </button>
            <div v-if="activeFaq === 1" class="px-4 pb-3">
              <div class="neomorph-inset rounded-3 p-3 bg-background">
                <p class="small text-on-surface-variant mb-0">
                  Standard Economy fares include one personal item and one carry-on bag. Checked baggage allowances vary by route and fare type.
                </p>
              </div>
            </div>
          </div>

          <!-- FAQ Item 3 -->
          <div
            :class="activeFaq === 2 ? 'neomorph-inset' : 'neomorph-outset'"
            class="rounded-3 overflow-hidden transition-all"
          >
            <button
              @click="toggleFaq(2)"
              class="btn border-0 w-100 px-4 py-3 d-flex justify-content-between align-items-center bg-transparent text-start cursor-pointer"
            >
              <span class="font-headline fs-6 text-on-background mb-0">Can I request a refund?</span>
              <span
                :class="{ 'rotate-180': activeFaq === 2 }"
                class="material-symbols-outlined text-outline transition-all"
                >expand_more</span
              >
            </button>
            <div v-if="activeFaq === 2" class="px-4 pb-3">
              <div class="neomorph-inset rounded-3 p-3 bg-background">
                <p class="small text-on-surface-variant mb-0">
                  Refund eligibility depends on the type of ticket purchased. Fully refundable fares can be cancelled online for a full return to the original payment method.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.tracking-widest {
  letter-spacing: 0.15em;
}
.rotate-180 {
  transform: rotate(180deg);
}
.backdrop-blur {
  backdrop-filter: blur(8px);
}
.hover-primary:hover {
  color: var(--primary) !important;
}
.card-hover:hover {
  transform: translateY(-4px);
}
</style>
