<script setup>
import { ref, onMounted } from 'vue'
import api from '@/../api'

const users = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const fetchUsers = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const res = await api.get('/users/all')
    users.value = res.data || []
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to fetch users.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const toggleAdminStatus = async (user) => {
  const newStatus = !user.isAdmin
  if (!confirm(`Are you sure you want to change admin status for ${user.email}?`)) return
  try {
    await api.patch(`/users/${user._id}/status`, { isAdmin: newStatus })
    await fetchUsers()
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to update user status.')
  }
}
</script>

<template>
  <main class="w-100 pt-5 bg-background pb-5 mt-5">
    <div class="max-w-1200 mx-auto px-3 my-4 d-flex flex-column gap-4">
      <div class="d-flex flex-column gap-2">
        <h1 class="font-display display-5 text-primary mb-0">User Directory</h1>
        <p class="font-body fs-6 text-on-surface-variant mb-0">
          Admin portal to view registered users and manage account privileges.
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
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u._id">
                <td class="fw-bold">{{ u.firstName }} {{ u.lastName }}</td>
                <td>{{ u.email }}</td>
                <td>{{ u.mobileNo }}</td>
                <td>
                  <span
                    :class="u.isAdmin ? 'badge bg-primary' : 'badge bg-secondary-subtle text-secondary'"
                  >
                    {{ u.isAdmin ? 'Admin' : 'Passenger' }}
                  </span>
                </td>
                <td class="text-end">
                  <button
                    @click="toggleAdminStatus(u)"
                    class="btn btn-sm border-0 neomorph-btn-primary px-3 py-1 rounded-3"
                  >
                    {{ u.isAdmin ? 'Revoke Admin' : 'Make Admin' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>
