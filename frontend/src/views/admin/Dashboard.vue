<template>
  <div>
    <Navbar />
    <div class="dashboard">
      <h1>Admin Dashboard</h1>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else-if="dashboard" class="dashboard-content">
        <!-- Users Stats -->
        <div class="section">
          <h2>Users Overview</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <h3>{{ dashboard.users.totalUsers }}</h3>
                <p>Total Users</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">💪</div>
              <div class="stat-info">
                <h3>{{ dashboard.users.totalMembers }}</h3>
                <p>Members</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">🏃</div>
              <div class="stat-info">
                <h3>{{ dashboard.users.totalTrainers }}</h3>
                <p>Trainers</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Stats -->
        <div class="section">
          <h2>Revenue Overview</h2>
          <div class="stats-grid">
            <div class="stat-card revenue">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <h3>${{ dashboard.revenue.totalRevenue }}</h3>
                <p>Total Revenue</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <h3>{{ dashboard.revenue.activeMemberships }}</h3>
                <p>Active Memberships</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sessions Stats -->
        <div class="section">
          <h2>Sessions Overview</h2>
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
                <h3>{{ dashboard.sessions.completionRate }}%</h3>
                <p>Completion Rate</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="actions">
          <router-link to="/admin/users" class="action-btn">
            Manage Users
          </router-link>
          <router-link to="/admin/memberships" class="action-btn secondary">
            Manage Memberships
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
    const response = await api.getAdminDashboard()
    dashboard.value = response.data
  } catch (error) {
    console.error('Failed to fetch dashboard:', error)
  } finally {
    loading.value = false
  }
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

.section {
  margin-bottom: 40px;
}

.section h2 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.5em;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.revenue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.revenue .stat-info h3,
.stat-card.revenue .stat-info p {
  color: white;
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
  font-size: 14px;
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
