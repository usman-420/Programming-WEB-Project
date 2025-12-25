<template>
  <div>
    <Navbar />
    <div class="users-page">
      <div class="page-header">
        <h1>User Management</h1>
        <button @click="openCreateModal" class="create-btn">+ Add User</button>
      </div>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else-if="users.length > 0" class="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.userId">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td><span class="role-badge">{{ user.roleName }}</span></td>
              <td>{{ user.phone || 'N/A' }}</td>
              <td>
                <span :class="'status-badge ' + (user.isActive ? 'active' : 'inactive')">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <button @click="toggleUserStatus(user)" class="action-btn">
                  {{ user.isActive ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <p>No users found.</p>
      </div>

      <!-- Create User Modal -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>Add New User</h2>
          <form @submit.prevent="createUser">
            <div class="form-group">
              <label>Name</label>
              <input v-model="userData.name" type="text" required />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input v-model="userData.email" type="email" required />
            </div>

            <div class="form-group">
              <label>Password</label>
              <input v-model="userData.password" type="password" required minlength="6" />
            </div>

            <div class="form-group">
              <label>Phone</label>
              <input v-model="userData.phone" type="tel" />
            </div>

            <div class="form-group">
              <label>Role</label>
              <select v-model.number="userData.roleId" required>
                <option value="1">Admin</option>
                <option value="2">Trainer</option>
                <option value="3">Member</option>
              </select>
            </div>

            <div v-if="error" class="error-msg">{{ error }}</div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
              <button type="submit" :disabled="submitting" class="submit-btn">
                {{ submitting ? 'Creating...' : 'Create User' }}
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

const users = ref([])
const loading = ref(true)
const showModal = ref(false)
const submitting = ref(false)
const error = ref('')

const userData = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  roleId: 3
})

const fetchUsers = async () => {
  try {
    const response = await api.getUsers()
    users.value = response.data
  } catch (err) {
    console.error('Failed to fetch users:', err)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  showModal.value = true
}

const createUser = async () => {
  if (submitting.value) return
  
  error.value = ''
  submitting.value = true

  try {
    await api.createUser(userData.value)
    closeModal()
    await fetchUsers()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create user'
  } finally {
    submitting.value = false
  }
}

const toggleUserStatus = async (user) => {
  try {
    await api.updateUser(user.id, {
      isActive: !user.isActive
    })
    await fetchUsers()
  } catch (err) {
    console.error('Failed to toggle user status:', err)
  }
}

const closeModal = () => {
  showModal.value = false
  error.value = ''
  userData.value = {
    name: '',
    email: '',
    password: '',
    phone: '',
    roleId: 3
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.users-page {
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

.users-table {
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

.role-badge {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.action-btn {
  padding: 6px 14px;
  background: #95a5a6;
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
