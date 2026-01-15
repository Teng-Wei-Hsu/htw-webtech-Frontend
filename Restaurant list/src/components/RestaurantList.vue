<template>
  <section class="restaurant-list">
    <h2 class="page-title">Restaurants List</h2>


    <p v-if="loading" class="loading">Loading restaurants...</p>

    <div v-else class="restaurant-container">
      <!-- use RestaurantCard subcomponent -->
      <RestaurantCard
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        :restaurant="restaurant"
        @delete="deleteRestaurant"
        @toggle-favorite="toggleFavorite"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RestaurantCard from './RestaurantCard.vue'

interface Restaurant {
  id: number
  name: string
  country: string
  city: string
  cuisineType: string
  rating: number
  reviews: string[]
  favorite: boolean
}

const restaurants = ref<Restaurant[]>([])
const loading = ref(true)

// Backend URL
const API_URL = 'https://htw-webtech-backend-vvi9.onrender.com/restaurants'

onMounted(async () => {
  try {
    const response = await fetch(API_URL)
    restaurants.value = await response.json()
  } catch (error) {
    console.error('Error fetching restaurants:', error)
  } finally {
    loading.value = false
  }
})

// DELETE restaurant
async function deleteRestaurant(id: number) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })

    restaurants.value = restaurants.value.filter(r => r.id !== id)
  } catch (error) {
    console.error('Error deleting restaurant:', error)
  }
}

// ⭐ TOGGLE FAVORITE (FIXED)
async function toggleFavorite(id: number) {
  const restaurant = restaurants.value.find(r => r.id === id)
  if (!restaurant) return

  try {
    await fetch(`${API_URL}/${id}/favorite`, {
      method: 'PATCH'
    })

    // update local state
    restaurant.favorite = !restaurant.favorite
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}
</script>

<style scoped>
.restaurant-list {
  margin-top: 2rem;
}

/* Centered title */
.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: #1f3d2b;
  margin-bottom: 2rem;
}

/* Loading text */
.loading {
  text-align: center;
  color: #777;
}

/* GRID LAYOUT */
.restaurant-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 👈 EXACTLY 3 */
  gap: 2rem;
}

/* Tablet */
@media (max-width: 1024px) {
  .restaurant-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 640px) {
  .restaurant-container {
    grid-template-columns: 1fr;
  }
}
</style>
