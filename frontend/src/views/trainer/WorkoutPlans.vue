<template>
  <div>
    <Navbar />
    <div class="plans-page">
      <div class="page-header">
        <h1>Workout Plans</h1>
        <button @click="showCreateModal = true" class="create-btn">+ Create New Plan</button>
      </div>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else-if="plans.length > 0" class="plans-grid">
        <div v-for="plan in plans" :key="plan.workoutPlansId" class="plan-card">
          <h3>{{ plan.planName }}</h3>
          <p class="description">{{ plan.description }}</p>
          <div class="plan-stats">
            <span>📅 {{ plan.durationWeeks }} weeks</span>
            <span>💪 {{ plan.exerciseCount }} exercises</span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>No workout plans yet. Create your first plan!</p>
      </div>

      <!-- Create Plan Modal -->
      <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>Create Workout Plan</h2>
          <form @submit.prevent="createPlan">
            <div class="form-group">
              <label>Plan Name</label>
              <input v-model="newPlan.planName" type="text" required />
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea v-model="newPlan.description" required></textarea>
            </div>

            <div class="form-group">
              <label>Duration (weeks)</label>
              <input v-model.number="newPlan.durationWeeks" type="number" min="1" required />
            </div>

            <div class="exercises-section">
              <h3>Exercises</h3>
              <div v-for="(exercise, index) in newPlan.exercises" :key="index" class="exercise-input">
                <input v-model="exercise.exerciseName" placeholder="Exercise Name" required />
                <input v-model.number="exercise.sets" type="number" placeholder="Sets" min="1" required />
                <input v-model.number="exercise.reps" type="number" placeholder="Reps" min="1" required />
                <input v-model.number="exercise.restTime" type="number" placeholder="Rest (sec)" min="0" required />
                <select v-model="exercise.muscleGroup" required>
                  <option value="">Select Muscle</option>
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Legs">Legs</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Arms">Arms</option>
                  <option value="Core">Core</option>
                  <option value="Cardio">Cardio</option>
                </select>
                <button type="button" @click="removeExercise(index)" class="remove-btn">×</button>
              </div>
              <button type="button" @click="addExercise" class="add-exercise-btn">+ Add Exercise</button>
            </div>

            <div v-if="error" class="error-msg">{{ error }}</div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
              <button type="submit" :disabled="submitting" class="submit-btn">
                {{ submitting ? 'Creating...' : 'Create Plan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../../components/Navbar.vue'
import api from '../../services/api'

const plans = ref([])
const loading = ref(true)
const showCreateModal = ref(false)
const submitting = ref(false)
const error = ref('')

const newPlan = ref({
  planName: '',
  description: '',
  durationWeeks: 4,
  exercises: [
    { exerciseName: '', sets: 3, reps: 10, restTime: 60, muscleGroup: '' }
  ]
})

const fetchPlans = async () => {
  try {
    const response = await api.getWorkoutPlans()
    plans.value = response.data
  } catch (err) {
    console.error('Failed to fetch plans:', err)
  } finally {
    loading.value = false
  }
}

const addExercise = () => {
  newPlan.value.exercises.push({
    exerciseName: '',
    sets: 3,
    reps: 10,
    restTime: 60,
    muscleGroup: ''
  })
}

const removeExercise = (index) => {
  if (newPlan.value.exercises.length > 1) {
    newPlan.value.exercises.splice(index, 1)
  }
}

const createPlan = async () => {
  if (submitting.value) return
  
  error.value = ''
  submitting.value = true

  try {
    await api.createWorkoutPlan(newPlan.value)
    closeModal()
    await fetchPlans()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create plan'
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  error.value = ''
  newPlan.value = {
    planName: '',
    description: '',
    durationWeeks: 4,
    exercises: [
      { exerciseName: '', sets: 3, reps: 10, restTime: 60, muscleGroup: '' }
    ]
  }
}

onMounted(() => {
  fetchPlans()
})
</script>

<style scoped>
.plans-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  margin: 0;
  color: #2c3e50;
}

.create-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.create-btn:hover {
  transform: translateY(-2px);
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

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.plan-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.plan-card:hover {
  transform: translateY(-2px);
}

.plan-card h3 {
  margin: 0 0 10px;
  color: #2c3e50;
}

.description {
  color: #666;
  margin: 10px 0;
  line-height: 1.5;
}

.plan-stats {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.plan-stats span {
  font-size: 14px;
  color: #555;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin: 0 0 20px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.exercises-section h3 {
  margin: 20px 0 15px;
  color: #2c3e50;
}

.exercise-input {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 40px;
  gap: 10px;
  margin-bottom: 10px;
}

.exercise-input input,
.exercise-input select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
}

.add-exercise-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.error-msg {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
  margin: 15px 0;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-btn {
  padding: 10px 20px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
