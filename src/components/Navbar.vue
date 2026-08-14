<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGlobalStore } from "@/stores/global";

const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  closeMobileMenu();
  globalStore.clearUserDetails();
  router.push("/login");
};
</script>

<template>
  <header
    class="position-fixed top-0 w-100 z-3 bg-background bg-opacity-75 backdrop-blur"
  >
    <div class="max-w-1200 mx-auto px-3 px-md-4 mt-2 mt-md-3">
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid px-3 px-md-4">
          <!-- Logo -->
          <router-link
            to="/"
            class="navbar-brand d-flex align-items-center me-0"
            @click="closeMobileMenu"
          >
            <!-- Your existing logo here -->
            <span class="fw-bold text-primary"> FlightBook </span>
          </router-link>

          <!-- Burger Toggle Button -->
          <button
            @click="toggleMobileMenu"
            class="navbar-toggler border-0 neomorph-outset p-2 rounded-3 text-primary d-lg-none cursor-pointer ms-auto"
            type="button"
            aria-controls="navbarContent"
            :aria-expanded="isMobileMenuOpen"
            aria-label="Toggle navigation"
          >
            <span class="material-symbols-outlined fs-3 align-middle">
              {{ isMobileMenuOpen ? "close" : "menu" }}
            </span>
          </button>

          <!-- Navbar Content -->
          <div
            id="navbarContent"
            class="collapse navbar-collapse"
            :class="{ show: isMobileMenuOpen }"
          >
            <!-- Navigation -->
            <div
              class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-1 gap-lg-2 ms-lg-auto py-3 py-lg-0"
            >
              <router-link
                to="/"
                @click="closeMobileMenu"
                class="nav-item-link text-decoration-none px-3 py-2 rounded-pill small transition-all w-100 w-lg-auto"
                :class="
                  route.path === '/'
                    ? 'neomorph-inset text-primary fw-bold active'
                    : 'text-on-surface-variant hover-primary'
                "
              >
                Home
              </router-link>

              <!-- Customer Links -->
              <template v-if="!globalStore.user.isAdmin">
                <router-link
                  to="/search-results"
                  @click="closeMobileMenu"
                  class="nav-item-link text-decoration-none px-3 py-2 rounded-pill small transition-all w-100 w-lg-auto"
                  :class="
                    route.path === '/search-results'
                      ? 'neomorph-inset text-primary fw-bold active'
                      : 'text-on-surface-variant hover-primary'
                  "
                >
                  Search Flights
                </router-link>

                <router-link
                  v-if="globalStore.user.token"
                  to="/my-bookings"
                  @click="closeMobileMenu"
                  class="nav-item-link text-decoration-none px-3 py-2 rounded-pill small transition-all w-100 w-lg-auto"
                  :class="
                    route.path === '/my-bookings'
                      ? 'neomorph-inset text-primary fw-bold active'
                      : 'text-on-surface-variant hover-primary'
                  "
                >
                  My Bookings
                </router-link>
              </template>

              <!-- Admin Links -->
              <template v-if="globalStore.user.isAdmin">
                <router-link
                  to="/manage-flights"
                  @click="closeMobileMenu"
                  class="nav-item-link text-decoration-none px-3 py-2 rounded-pill small transition-all w-100 w-lg-auto"
                  :class="
                    route.path.startsWith('/manage-flights') ||
                    route.path.startsWith('/add-flight') ||
                    route.path.startsWith('/edit-flight')
                      ? 'neomorph-inset text-primary fw-bold active'
                      : 'text-on-surface-variant hover-primary'
                  "
                >
                  Manage Flights
                </router-link>

                <router-link
                  to="/admin/bookings"
                  @click="closeMobileMenu"
                  class="nav-item-link text-decoration-none px-3 py-2 rounded-pill small transition-all w-100 w-lg-auto"
                  :class="
                    route.path === '/admin/bookings'
                      ? 'neomorph-inset text-primary fw-bold active'
                      : 'text-on-surface-variant hover-primary'
                  "
                >
                  System Bookings
                </router-link>

                <router-link
                  to="/admin/users"
                  @click="closeMobileMenu"
                  class="nav-item-link text-decoration-none px-3 py-2 rounded-pill small transition-all w-100 w-lg-auto"
                  :class="
                    route.path === '/admin/users'
                      ? 'neomorph-inset text-primary fw-bold active'
                      : 'text-on-surface-variant hover-primary'
                  "
                >
                  Users
                </router-link>
              </template>

              <!-- About -->
              <router-link
                to="/about-us"
                @click="closeMobileMenu"
                class="nav-item-link text-decoration-none px-3 py-2 rounded-pill small transition-all w-100 w-lg-auto"
                :class="
                  route.path === '/about-us'
                    ? 'neomorph-inset text-primary fw-bold active'
                    : 'text-on-surface-variant hover-primary'
                "
              >
                About
              </router-link>

              <!-- Auth -->
              <div
                class="auth-container d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 pt-2 pt-lg-0 ms-lg-2 w-100 w-lg-auto"
              >
                <!-- Logged Out -->
                <template v-if="!globalStore.user.token">
                  <router-link
                    to="/login"
                    @click="closeMobileMenu"
                    class="btn border-0 neomorph-btn-primary px-3 py-2 rounded-3 small text-secondary hover-primary text-decoration-none text-center"
                  >
                    Login
                  </router-link>

                  <router-link
                    to="/signup"
                    @click="closeMobileMenu"
                    class="btn border-0 bg-primary text-on-primary px-3 py-2 rounded-3 small neomorph-btn-primary text-decoration-none text-center"
                  >
                    Sign Up
                  </router-link>
                </template>

                <!-- Logged In -->
                <template v-else>
                  <router-link
                    to="/profile"
                    @click="closeMobileMenu"
                    class="small font-headline text-primary text-decoration-none hover-primary text-nowrap"
                  >
                    Hi, {{ globalStore.user.firstName || "Traveler" }}
                  </router-link>

                  <button
                    @click="handleLogout"
                    class="btn border-0 bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-3 small cursor-pointer"
                  >
                    Logout
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.backdrop-blur {
  backdrop-filter: blur(8px);
}
.hover-primary:hover {
  color: var(--primary) !important;
}
.tracking-tight {
  letter-spacing: -0.02em;
}
@media (max-width: 991.98px) {
  .auth-container {
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }
}
</style>
