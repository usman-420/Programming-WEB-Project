<template>
  <div>
    <Navbar />
    <div class="members-page">
      <h1>Members</h1>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else-if="members.length > 0" class="members-content">
        <div class="members-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Active Sessions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in members" :key="member.id">
                <td>{{ member.name }}</td>
                <td>{{ member.email }}</td>
                <td>{{ member.phone || 'N/A' }}</td>
                <td>{{ member.activeSessions || 0 }}</td>
                <td>
                  <button @click="openAssignModal(member)" class="assign-btn">
                    Assign Workout
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>No members found.</p>
      </div>

      <!-- Assign Workout Modal -->
      <div v-if="showAssignModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>Assign Workout to {{ selectedMember?.name }}</h2>
          <form @submit.prevent="assignWorkout">
            <div class="form-group">
              <label>Workout Plan</label>
              <select v-model.number="assignData.workoutPlansId" required>
                <option value="">Select a plan</option>
                <option v-for="plan in workoutPlans" :key="plan.id" :value="plan.id">
                  {{ plan.name }} ({{ plan.durationWeeks }} weeks)
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Session Date</label>
              <input v-model="assignData.date" type="date" required />
            </div>

            <div v-if="error" class="error-msg">{{ error }}</div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
              <button type="submit" :disabled="submitting" class="submit-btn">
                {{ submitting ? 'Assigning...' : 'Assign' }}
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

const members = ref([])
const workoutPlans = ref([])
const loading = ref(true)
const showAssignModal = ref(false)
const selectedMember = ref(null)
const submitting = ref(false)
const error = ref('')

const assignData = ref({
  workoutPlansId: '',
  date: ''
})

const fetchMembers = async () => {
  try {
    const response = await api.getUsers({ role: 'member' })
    members.value = response.data
  } catch (err) {
    console.error('Failed to fetch members:', err)
  } finally {
    loading.value = false
  }
}

const fetchWorkoutPlans = async () => {
  try {
    const response = await api.getWorkoutPlans()
    workoutPlans.value = response.data
  } catch (err) {
    console.error('Failed to fetch workout plans:', err)
  }
}

const openAssignModal = (member) => {
  selectedMember.value = member
  showAssignModal.value = true
  
  // Set default date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  assignData.value.date = tomorrow.toISOString().split('T')[0]
}

const assignWorkout = async () => {
  if (submitting.value) return
  
  error.value = ''
  submitting.value = true

  try {
    await api.createSession({
      memberId: parseInt(selectedMember.value.id),
      workoutPlansId: parseInt(assignData.value.workoutPlansId),
      date: assignData.value.date
    })
    
    closeModal()
    await fetchMembers()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to assign workout'
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showAssignModal.value = false
  selectedMember.value = null
  error.value = ''
  assignData.value = {
    workoutPlansId: '',
    date: ''
  }
}

onMounted(() => {
  fetchMembers()
  fetchWorkoutPlans()
})
</script>

<style scoped>
.members-page {
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

.members-table {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #dee2e6;
}

td {
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
  color: #2c3e50;
}

tr:last-child td {
  border-bottom: none;
}

.assign-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
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
  max-width: 500px;
  width: 90%;
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

.form-group select,
.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
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
