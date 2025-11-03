import { createRouter, createWebHistory } from 'vue-router'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/home', name: 'home', component: Home },

  {
    path: '/home-cliente',
    component: () => import('../views/HomeClient.vue'),
    meta: { role: 'cliente' }
  },
  {
    path: '/home-vendedor',
    component: () => import('../views/HomeVendor.vue'),
    meta: { role: 'vendedor' }
  },
  {
    path: '/home-repartidor',
    component: () => import('../views/HomeDelivery.vue'),
    meta: { role: 'repartidor' }
  },
  {
      path: '/buscar-restaurantes',
      component: () => import('../views/client/SearchRestaurants.vue'),
      meta: { role: 'cliente' }
    },
  {
      path: '/carrito',
      component: () => import('../views/client/Cart.vue'),
      meta: { role: 'cliente' }
    },
  {
      path: '/pedidos',
      component: () => import('../views/client/Orders.vue'),
      meta: { role: 'cliente' }
    },
  {
    path: '/favoritos',
    component: () => import('../views/client/Favorites.vue'),
    meta: { role: 'cliente' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guard global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Si la ruta requiere rol
  if (to.meta.role) {
    if (!authStore.isLoggedIn) return next('/login')

    if (authStore.userRole !== to.meta.role) {
      alert('No tienes permisos para acceder a esta sección.')
      return next('/home') // Vuelve a Home para elegir rol
    }
  }

  next()
})

export default router




