<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <h2>🏋️ Gym Tracker</h2>
      </div>

      <div class="nav-menu">
        <!-- Member Nav -->
        <template v-if="isMember">
          <router-link to="/member" class="nav-link">Dashboard</router-link>
          <router-link to="/member/workouts" class="nav-link">My Workouts</router-link>
        </template>

        <!-- Trainer Nav -->
        <template v-if="isTrainer">
          <router-link to="/trainer" class="nav-link">Dashboard</router-link>
          <router-link to="/trainer/plans" class="nav-link">Workout Plans</router-link>
          <router-link to="/trainer/members" class="nav-link">Members</router-link>
        </template>

        <!-- Admin Nav -->
        <template v-if="isAdmin">
          <router-link to="/admin" class="nav-link">Dashboard</router-link>
          <router-link to="/admin/users" class="nav-link">Users</router-link>
          <router-link to="/admin/memberships" class="nav-link">Memberships</router-link>
        </template>

        <div class="nav-user">
          <span class="user-name">👤 {{ userName }}</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isMember = computed(() => authStore.isMember)
const isTrainer = computed(() => authStore.isTrainer)
const isAdmin = computed(() => authStore.isAdmin)
const userName = computed(() => authStore.userName)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: #2c3e50;
  color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.nav-brand h2 {
  margin: 0;
  font-size: 1.5em;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255,255,255,0.1);
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid rgba(255,255,255,0.2);
}

.user-name {
  font-weight: 500;
}

.logout-btn {
  padding: 8px 15px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c0392b;
}
</style>
