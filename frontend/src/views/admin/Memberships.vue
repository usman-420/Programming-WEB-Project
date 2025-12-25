<template>
  <div>
    <Navbar />
    <div class="memberships-page">
      <div class="page-header">
        <h1>Membership Management</h1>
        <button @click="openCreateModal" class="create-btn">+ Add Membership</button>
      </div>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else-if="memberships.length > 0" class="memberships-table">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="membership in memberships" :key="membership.id">
              <td>{{ membership.userName }}</td>
              <td>{{ membership.name }}</td>
              <td>{{ formatDate(membership.startDate) }}</td>
              <td>{{ formatDate(membership.endDate) }}</td>
              <td>${{ membership.price }}</td>
              <td>
                <span :class="'status-badge ' + membership.status">
                  {{ membership.status }}
                </span>
              </td>
              <td>
                <button @click="deleteMembership(membership.id)" class="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <p>No memberships found.</p>
      </div>

      <!-- Create Membership Modal -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>Add New Membership</h2>
          <form @submit.prevent="createMembership">
            <div class="form-group">
              <label>Member</label>
              <select v-model.number="membershipData.userId" required>
                <option value="">Select a member</option>
                <option v-for="member in members" :key="member.id" :value="member.id">
                  {{ member.name }} ({{ member.email }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Membership Type</label>
              <select v-model="membershipData.name" required @change="updatePrice">
                <option value="">Select type</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div class="form-group">
              <label>Start Date</label>
              <input v-model="membershipData.startDate" type="date" required />
            </div>

            <div class="form-group">
              <label>End Date</label>
              <input v-model="membershipData.endDate" type="date" required />
            </div>

            <div class="form-group">
              <label>Price ($)</label>
              <input v-model.number="membershipData.price" type="number" step="0.01" required />
            </div>

            <div v-if="error" class="error-msg">{{ error }}</div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
              <button type="submit" :disabled="submitting" class="submit-btn">
                {{ submitting ? 'Creating...' : 'Create Membership' }}
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

const memberships = ref([])
const members = ref([])
const loading = ref(true)
const showModal = ref(false)
const submitting = ref(false)
const error = ref('')

const membershipData = ref({
  userId: '',
  name: '',
  startDate: '',
  endDate: '',
  price: 0
})

const membershipPrices = {
  'Basic': 50,
  'Premium': 100,
  'VIP': 200
}

const fetchMemberships = async () => {
  try {
    const response = await api.getMemberships()
    memberships.value = response.data
  } catch (err) {
    console.error('Failed to fetch memberships:', err)
  } finally {
    loading.value = false
  }
}

const fetchMembers = async () => {
  try {
    const response = await api.getUsers({ role: 'member' })
    members.value = response.data
  } catch (err) {
    console.error('Failed to fetch members:', err)
  }
}

const openCreateModal = () => {
  // Set default dates
  const today = new Date()
  const nextMonth = new Date(today)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  
  membershipData.value.startDate = today.toISOString().split('T')[0]
  membershipData.value.endDate = nextMonth.toISOString().split('T')[0]
  
  showModal.value = true
}

const updatePrice = () => {
  const type = membershipData.value.name
  if (membershipPrices[type]) {
    membershipData.value.price = membershipPrices[type]
  }
}

const createMembership = async () => {
  if (submitting.value) return
  
  error.value = ''
  submitting.value = true

  try {
    await api.createMembership(membershipData.value)
    closeModal()
    await fetchMemberships()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create membership'
  } finally {
    submitting.value = false
  }
}

const deleteMembership = async (id) => {
  if (!confirm('Are you sure you want to delete this membership?')) return
  
  try {
    await api.deleteMembership(id)
    await fetchMemberships()
  } catch (err) {
    console.error('Failed to delete membership:', err)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const closeModal = () => {
  showModal.value = false
  error.value = ''
  membershipData.value = {
    userId: '',
    name: '',
    startDate: '',
    endDate: '',
    price: 0
  }
}

onMounted(() => {
  fetchMemberships()
  fetchMembers()
})
</script>

<style scoped>
.memberships-page {
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

.memberships-table {
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

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.expired {
  background: #f8d7da;
  color: #721c24;
}

.delete-btn {
  padding: 6px 14px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
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

.form-group input,
.form-group select {
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
