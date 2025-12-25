<template>
  <div>
    <Navbar />
    <div class="dashboard">
      <h1>Trainer Dashboard</h1>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else-if="dashboard" class="dashboard-content">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>{{ dashboard.activeMembers }}</h3>
              <p>Active Members</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <h3>{{ dashboard.totalSessions }}</h3>
              <p>Total Sessions</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>{{ dashboard.completedSessions }}</h3>
              <p>Completed</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">❌</div>
            <div class="stat-info">
              <h3>{{ dashboard.missedSessions }}</h3>
              <p>Missed</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <h3>{{ dashboard.scheduledSessions }}</h3>
              <p>Scheduled</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-info">
              <h3>{{ dashboard.rating || 'N/A' }}</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </div>

        <!-- Upcoming Sessions -->
        <div v-if="dashboard.upcomingSessions && dashboard.upcomingSessions.length > 0" class="sessions-card">
          <h2>Upcoming Sessions</h2>
          <div class="sessions-list">
            <div v-for="session in dashboard.upcomingSessions" :key="session.sessionId" class="session-item">
              <div class="session-info">
                <h4>{{ session.memberName }}</h4>
                <p>{{ session.workoutPlanName }}</p>
                <p class="session-date">{{ formatDate(session.date) }}</p>
              </div>
              <div class="session-status">
                <span :class="'badge-' + session.status">{{ session.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="actions">
          <router-link to="/trainer/plans" class="action-btn">
            Manage Workout Plans
          </router-link>
          <router-link to="/trainer/members" class="action-btn secondary">
            View Members
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
    const response = await api.getTrainerDashboard()
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 2.5em;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.8em;
  color: #2c3e50;
}

.stat-info p {
  margin: 5px 0 0;
  color: #666;
  font-size: 14px;
}

.sessions-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.sessions-card h2 {
  margin: 0 0 20px;
  color: #2c3e50;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}

.session-info h4 {
  margin: 0 0 5px;
  color: #2c3e50;
}

.session-info p {
  margin: 3px 0;
  color: #666;
  font-size: 14px;
}

.session-date {
  font-weight: 600;
  color: #667eea;
}

.badge-scheduled {
  background: #3498db;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-completed {
  background: #27ae60;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-missed {
  background: #e74c3c;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
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

.action-btn.secondary {
  background: #95a5a6;
}

.action-btn:hover {
  transform: translateY(-2px);
}
</style>
