<template>
  <div class="home-container">
    <!-- Header -->
    <header class="home-header">
      <h1>comidApp</h1>
      <div>
        <button class="btn" @click="goTo('/home')">Volver</button>
      </div>
    </header>

    <main class="home-main">
      <h2>Panel del Vendedor</h2>
      <p>Gestiona tu negocio fácilmente</p>

      <div class="home-options">
        <div class="option-card" @click="goTo('/mis-productos')">
          <i class="fa-solid fa-boxes-stacked"></i>
          <h3>Mis Productos</h3>
        </div>

        <div class="option-card" @click="goTo('/pedidos-vendedor')">
          <i class="fa-solid fa-clipboard-list"></i>
          <h3>Pedidos Recibidos</h3>
        </div>

        <div class="option-card" @click="goTo('/reportes')">
          <i class="fa-solid fa-chart-line"></i>
          <h3>Reportes</h3>
        </div>

        <div class="option-card" @click="goTo('/perfil-vendedor')">
          <i class="fa-solid fa-user-gear"></i>
          <h3>Mi Perfil</h3>
        </div>
      </div>

      <!-- Sección de Restaurantes del Vendedor -->
      <section class="restaurants-section">
        <div class="section-header">
          <h2>Mis Restaurantes</h2>
          <button class="btn btn-primary" @click="showAddModal = true">
            <i class="fa-solid fa-plus"></i> Agregar Restaurante
          </button>
        </div>

        <div v-if="restaurants.length === 0" class="empty-state">
          <p>No tienes restaurantes aún</p>
        </div>

        <div v-else class="restaurants-grid">
          <div 
            v-for="restaurant in restaurants" 
            :key="restaurant.id" 
            class="restaurant-card"
          >
            <div class="restaurant-image">
              <img :src="restaurant.image || 'https://via.placeholder.com/300x200'" :alt="restaurant.nombre">
            </div>
            <div class="restaurant-info">
              <h3>{{ restaurant.nombre }}</h3>
              <p>{{ restaurant.categoria }}</p>
              <div class="restaurant-actions">
                <button class="btn btn-edit" @click="editRestaurant(restaurant)">Editar</button>
                <button class="btn btn-delete" @click="deleteRestaurant(restaurant.id)">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal para Agregar/Editar Restaurante -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ editMode ? 'Editar Restaurante' : 'Agregar Restaurante' }}</h3>
        <form @submit.prevent="saveRestaurant">
          <label>Nombre:</label>
          <input type="text" v-model="restaurantForm.nombre" required />

          <label>Descripción:</label>
          <textarea v-model="restaurantForm.descripcion"></textarea>

          <label>Dirección:</label>
          <input type="text" v-model="restaurantForm.direccion" required />

          <label>Categoría:</label>
          <input type="text" v-model="restaurantForm.categoria" required />

          <label>Horario Apertura:</label>
          <input type="time" v-model="restaurantForm.horarioApertura" required />

          <label>Horario Cierre:</label>
          <input type="time" v-model="restaurantForm.horarioCierre" required />

          <label>Imagen URL:</label>
          <input type="text" v-model="restaurantForm.image" />

          <div class="modal-actions">
            <button type="submit" class="btn btn-primary">{{ editMode ? 'Actualizar' : 'Agregar' }}</button>
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goTo = (path) => router.push(path)

// Estados
const restaurants = ref([]) // comienza vacío
const showAddModal = ref(false)
const editMode = ref(false)
const restaurantForm = ref({
  id: null,
  nombre: '',
  descripcion: '',
  direccion: '',
  categoria: '',
  horarioApertura: '',
  horarioCierre: '',
  image: ''
})

// Funciones
const saveRestaurant = () => {
  if(editMode.value) {
    // Editar restaurante existente
    const index = restaurants.value.findIndex(r => r.id === restaurantForm.value.id)
    if(index !== -1) restaurants.value[index] = { ...restaurantForm.value }
  } else {
    // Agregar nuevo restaurante
    const newRestaurant = {
      ...restaurantForm.value,
      id: Date.now() // genera un ID único temporal
    }
    restaurants.value.push(newRestaurant)
  }
  closeModal()
}

const editRestaurant = (restaurant) => {
  editMode.value = true
  restaurantForm.value = { ...restaurant }
  showAddModal.value = true
}

const deleteRestaurant = (id) => {
  if(confirm('¿Estás seguro de eliminar este restaurante?')) {
    restaurants.value = restaurants.value.filter(r => r.id !== id)
  }
}

const closeModal = () => {
  showAddModal.value = false
  editMode.value = false
  restaurantForm.value = {
    id: null,
    nombre: '',
    descripcion: '',
    direccion: '',
    categoria: '',
    horarioApertura: '',
    horarioCierre: '',
    image: ''
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #667eea;
  color: white;
}

.home-header .btn {
  padding: 10px 20px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  background: white;
  color: #667eea;
  font-weight: bold;
}

.home-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.home-options {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.option-card {
  background: white;
  border-radius: 15px;
  flex: 1;
  min-width: 200px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.option-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.restaurants-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.restaurant-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.restaurant-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.restaurant-info {
  padding: 15px;
}

.restaurant-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 10px;
  cursor: pointer;
}

.btn-edit {
  background: #f0ad4e;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-delete {
  background: #d9534f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left:0;
  right:0;
  bottom:0;
  background: rgba(0,0,0,0.5);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index: 999;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
}

.modal-content h3 {
  margin-bottom: 20px;
}

.modal-content label {
  display:block;
  margin-top:10px;
  font-weight:bold;
}

.modal-content input, .modal-content textarea {
  width:100%;
  padding:8px;
  margin-top:5px;
  border-radius:8px;
  border:1px solid #ccc;
}

.modal-actions {
  display:flex;
  justify-content:flex-end;
  gap:10px;
  margin-top:20px;
}

.btn-secondary {
  background: #ccc;
  color: #333;
  border:none;
  padding:8px 15px;
  border-radius:10px;
  cursor:pointer;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #666;
}
</style>




