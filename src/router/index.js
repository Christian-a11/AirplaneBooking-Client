import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
import SearchResults from '@/pages/SearchResults.vue'
import PassengerDetails from '@/pages/PassengerDetails.vue'
import BookingConfirmed from '@/pages/BookingConfirmed.vue'
import MyBookings from '@/pages/MyBookings.vue'
import ManageFlights from '@/pages/ManageFlights.vue'
import AddFlight from '@/pages/AddFlight.vue'
import AboutUs from '@/pages/AboutUs.vue'
import Login from '@/pages/Login.vue'
import Signup from '@/pages/Signup.vue'
import AdminUsers from '@/pages/AdminUsers.vue'
import AdminBookings from '@/pages/AdminBookings.vue'
import Profile from '@/pages/Profile.vue'
import EditFlight from '@/pages/EditFlight.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/search-results', name: 'SearchResults', component: SearchResults },
  { path: '/passenger-details', name: 'PassengerDetails', component: PassengerDetails },
  { path: '/booking-confirmed', name: 'BookingConfirmed', component: BookingConfirmed },
  { path: '/my-bookings', name: 'MyBookings', component: MyBookings },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/manage-flights', name: 'ManageFlights', component: ManageFlights },
  { path: '/add-flight', name: 'AddFlight', component: AddFlight },
  { path: '/edit-flight/:flightId', name: 'EditFlight', component: EditFlight },
  { path: '/admin/users', name: 'AdminUsers', component: AdminUsers },
  { path: '/admin/bookings', name: 'AdminBookings', component: AdminBookings },
  { path: '/about-us', name: 'AboutUs', component: AboutUs },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
