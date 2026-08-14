<script setup></script>

<template>
  <footer class="w-100 bg-surface-container-low py-5 mt-5">
    <div
      class="max-w-1200 mx-auto px-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3"
    >
      <router-link to="/" class="d-flex align-items-center gap-2 text-decoration-none">
        <img
          alt="SkyBook Logo"
          class="opacity-50"
          style="height: 24px; filter: grayscale(100%);"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8mpObndNhO4DzVJT13_bym92YiZ-Von6n5ck1S6z4lE9itINaVMX9oBQTKCXV1REft6KsJpI5jON2ZzJGYpLdw-gSGVVXul0e-oGkDTPBbhWGLO0ZsFWolzOleZ5NXG9BLe9b_baMtlSRU4VlvltVOqojq6-5J5-V9AEQrlxSuhEMnWOz8Vjrhb5NXSQIJ6ghPOMcNuV2oq-Fp7OFOrifS2lxi22WS1JE1LMj3Y6IRR5OwGVw4Ot73LJFhMHcMVrBogeFZT5AquE"
        />
        <span
          class="font-headline small text-on-surface-variant text-uppercase tracking-widest"
          >SkyBook</span
        >
      </router-link>

      <div class="small text-on-surface-variant">
        © 2026 SkyBook Aviation Group. All rights reserved.
      </div>

      <div class="d-flex gap-4">
        <router-link
          to="/about-us"
          class="small text-on-surface-variant text-decoration-none hover-primary"
          >About Us</router-link
        >
        <a
          class="small text-on-surface-variant text-decoration-none hover-primary cursor-pointer"
          >Privacy</a
        >
        <a
          class="small text-on-surface-variant text-decoration-none hover-primary cursor-pointer"
          >Terms</a
        >
      </div>
    </div>
  </footer>
</template>

<style scoped>
.hover-primary:hover {
  color: var(--primary) !important;
}
.tracking-widest {
  letter-spacing: 0.15em;
}
</style>
