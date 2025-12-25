<template>
  <div>
    <Navbar />
    <div class="dashboard">
      <h1>Member Dashboard</h1>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else-if="dashboard" class="dashboard-content">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <h3>{{ dashboard.sessions.totalSessions }}</h3>
              <p>Total Sessions</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>{{ dashboard.sessions.completedSessions }}</h3>
              <p>Completed</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">❌</div>
            <div class="stat-info">
              <h3>{{ dashboard.sessions.missedSessions }}</h3>
              <p>Missed</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-info">
              <h3>{{ dashboard.sessions.completionRate || 0 }}%</h3>
              <p>Completion Rate</p>
            </div>
          </div>
        </div>

        <!-- Membership Info -->
        <div v-if="dashboard.membership" class="membership-card">
          <h2>Active Membership</h2>
          <div class="membership-details">
            <p><strong>Plan:</strong> {{ dashboard.membership.name }}</p>
            <p><strong>Status:</strong> <span :class="'status-' + dashboard.membership.status">{{ dashboard.membership.status }}</span></p>
            <p><strong>Start Date:</strong> {{ formatDate(dashboard.membership.startDate) }}</p>
            <p><strong>End Date:</strong> {{ formatDate(dashboard.membership.endDate) }}</p>
            <p><strong>Price:</strong> ${{ dashboard.membership.price }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="actions">
          <router-link to="/member/workouts" class="action-btn">
            View My Workouts
          </router-link>
        </div>
      </div>

      <div v-else class="error">Failed to load dashboard</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../../components/Navbar.vue'
import api from '../../services/api'

const dashboard = ref(null)
const loading = ref(true)

const fetchDashboard = async () => {
  try {
    const response = await api.getMemberDashboard()
    dashboard.value = response.data
  } catch (error) {
    console.error('Failed to fetch dashboard:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
}

.error {
  background: #fee;
  color: #c00;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  font-size: 3em;
}

.stat-info h3 {
  margin: 0;
  font-size: 2em;
  color: #2c3e50;
}

.stat-info p {
  margin: 5px 0 0;
  color: #666;
}

.membership-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.membership-card h2 {
  margin: 0 0 20px;
  color: #2c3e50;
}

.membership-details p {
  margin: 10px 0;
  font-size: 16px;
  color: #2c3e50;
}

.membership-details strong {
  color: #2c3e50;
}

.status-active {
  color: #27ae60;
  font-weight: 600;
  text-transform: uppercase;
}

.status-expired {
  color: #e74c3c;
  font-weight: 600;
  text-transform: uppercase;
}

.actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  display: inline-block;
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
}
</style>
