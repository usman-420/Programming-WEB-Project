<template>
  <div>
    <Navbar />
    <div class="workout-detail-page">
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else-if="session" class="workout-content">
        <div class="workout-header">
          <h1>{{ session.workoutPlanName }}</h1>
          <span :class="'badge-' + session.status">{{ session.status }}</span>
        </div>

        <div class="workout-info">
          <div class="info-card">
            <p><strong>Date:</strong> {{ formatDate(session.date) }}</p>
            <p><strong>Trainer:</strong> {{ session.trainerName }}</p>
            <p v-if="session.completionRate !== undefined && session.completionRate !== null"><strong>Completion:</strong> {{ session.completionRate }}%</p>
          </div>
        </div>

        <div class="exercises-section">
          <h2>Exercises</h2>
          <div v-if="exercises.length > 0" class="exercises-list">
            <div v-for="exercise in exercises" :key="exercise.id" class="exercise-item">
              <div class="exercise-checkbox">
                <input 
                  type="checkbox" 
                  :id="'ex-' + exercise.id"
                  v-model="completedExercises"
                  :value="exercise.id"
                  :disabled="session.status === 'completed' || session.status === 'missed'"
                />
              </div>
              <div class="exercise-info">
                <h3>{{ exercise.name }}</h3>
                <div class="exercise-details">
                  <span>{{ exercise.sets }} sets</span>
                  <span>{{ exercise.reps }} reps</span>
                  <span>{{ exercise.restTime }}s rest</span>
                  <span class="muscle-group">{{ exercise.notes || 'General' }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No exercises found for this workout.</p>
          </div>
        </div>

        <div v-if="session.status === 'scheduled'" class="actions">
          <button @click="completeWorkout" :disabled="submitting" class="complete-btn">
            {{ submitting ? 'Saving...' : 'Complete Workout' }}
          </button>
        </div>

        <div v-if="message" :class="'message ' + messageType">
          {{ message }}
        </div>

        <div class="back-link">
          <router-link to="/member/workouts">← Back to Workouts</router-link>
        </div>
      </div>

      <div v-else class="error">Workout not found</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import api from '../../services/api'

const route = useRoute()
const router = useRouter()

const session = ref(null)
const exercises = ref([])
const completedExercises = ref([])
const loading = ref(true)
const submitting = ref(false)
const message = ref('')
const messageType = ref('success')

const fetchSession = async () => {
  try {
    const sessionId = route.params.id
    const response = await api.getSession(sessionId)
    session.value = response.data
    exercises.value = response.data.exercises || []
    
    // If already completed, mark all exercises as checked
    if (session.value.status === 'completed' && session.value.completedExercises) {
      completedExercises.value = session.value.completedExercises.split(',').map(Number)
    }
  } catch (error) {
    console.error('Failed to fetch session:', error)
  } finally {
    loading.value = false
  }
}

const completeWorkout = async () => {
  if (submitting.value) return
  
  submitting.value = true
  message.value = ''
  
  try {
    const sessionId = route.params.id
    await api.completeSession(sessionId, {
      completedExercises: completedExercises.value
    })
    
    message.value = 'Workout completed successfully!'
    messageType.value = 'success'
    
    // Refresh session data
    await fetchSession()
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/member/workouts')
    }, 2000)
  } catch (error) {
    message.value = error.response?.data?.message || 'Failed to complete workout'
    messageType.value = 'error'
  } finally {
    submitting.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchSession()
})
</script>

<style scoped>
.workout-detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
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

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.workout-header h1 {
  margin: 0;
  color: #2c3e50;
}

.badge-scheduled {
  background: #3498db;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-completed {
  background: #27ae60;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-missed {
  background: #e74c3c;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.workout-info {
  margin-bottom: 30px;
}

.info-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.info-card p {
  margin: 10px 0;
  font-size: 16px;
  color: #2c3e50;
}

.info-card strong {
  color: #2c3e50;
}

.exercises-section {
  margin-bottom: 30px;
}

.exercises-section h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.exercises-list {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.exercise-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.exercise-item:last-child {
  border-bottom: none;
}

.exercise-checkbox input[type="checkbox"] {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.exercise-checkbox input[type="checkbox"]:disabled {
  cursor: not-allowed;
}

.exercise-info {
  flex: 1;
}

.exercise-info h3 {
  margin: 0 0 10px;
  color: #2c3e50;
  font-size: 1.2em;
}

.exercise-details {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.exercise-details span {
  background: #f0f0f0;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 14px;
  color: #555;
}

.muscle-group {
  background: #667eea !important;
  color: white !important;
}

.empty-state {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.actions {
  margin: 30px 0;
}

.complete-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.complete-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.complete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  text-align: center;
  font-weight: 600;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.back-link {
  margin-top: 30px;
}

.back-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
