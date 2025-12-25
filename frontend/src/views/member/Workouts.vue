<template>
  <div>
    <Navbar />
    <div class="workouts-page">
      <h1>My Workouts</h1>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else-if="sessions.length > 0" class="workouts-content">
        <div class="workouts-grid">
          <div v-for="session in sessions" :key="session.id" class="workout-card">
            <div class="workout-header">
              <h3>{{ session.workoutPlanName }}</h3>
              <span :class="'badge-' + session.status">{{ session.status }}</span>
            </div>
            <div class="workout-details">
              <p><strong>Date:</strong> {{ formatDate(session.date) }}</p>
              <p><strong>Trainer:</strong> {{ session.trainerName }}</p>
              <p v-if="session.completionRate !== undefined && session.completionRate !== null">
                <strong>Completion:</strong> {{ session.completionRate }}%
              </p>
            </div>
            <div class="workout-actions">
              <router-link 
                :to="`/member/workout/${session.id}`" 
                class="view-btn"
              >
                {{ session.status === 'scheduled' ? 'Start Workout' : 'View Details' }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>No workouts assigned yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import api from '../../services/api'

const router = useRouter()
const sessions = ref([])
const loading = ref(true)

const fetchSessions = async () => {
  try {
    const response = await api.getSessions()
    sessions.value = response.data
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchSessions()
})
</script>

<style scoped>
.workouts-page {
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

.empty-state {
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.empty-state p {
  font-size: 18px;
  color: #666;
}

.workouts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.workout-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 25px;
  transition: transform 0.2s;
}

.workout-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 15px;
}

.workout-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3em;
}

.badge-scheduled {
  background: #3498db;
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-completed {
  background: #27ae60;
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-missed {
  background: #e74c3c;
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.workout-details {
  margin: 15px 0;
}

.workout-details p {
  margin: 8px 0;
  color: #555;
}

.workout-details strong {
  color: #2c3e50;
}

.workout-actions {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.view-btn {
  display: inline-block;
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  text-align: center;
  transition: transform 0.2s;
}

.view-btn:hover {
  transform: scale(1.02);
}
</style>
