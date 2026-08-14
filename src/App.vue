<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useGlobalStore } from "./stores/global.js";
import { onBeforeMount } from "vue";
const route = useRoute();
const { setUserDetails } = useGlobalStore();
onBeforeMount(() => {
  setUserDetails(localStorage.getItem("token"));
});
const hideNavbar = computed(() => ["/login", "/signup"].includes(route.path));
</script>

<template>
  <div
    class="min-vh-100 bg-background text-on-background d-flex flex-column justify-content-between"
  >
    <Navbar v-if="!hideNavbar" />
    <router-view />
    <Footer v-if="!hideNavbar" />
  </div>
</template>

<style scoped></style>
