<template>
  <section class="restaurant-list">
    <h1 class="page-title">Restaurants List</h1>


    <p v-if="loading" class="loading">Loading restaurants...</p>

    <div v-else class="restaurant-container">
      <!-- use RestaurantCard subcomponent -->
      <RestaurantCard
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        :restaurant="restaurant"
        @delete="deleteRestaurant"
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

    // remove from list
    restaurants.value = restaurants.value.filter(r => r.id !== id)

  } catch (error) {
    console.error('Error deleting restaurant:', error)
  }
}
</script>

<style scoped>
.restaurant-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.page-title {
  text-align: center;
  font-size: 2.3rem;
  color: #1f7a63;
  margin-bottom: 2.5rem;
}

.loading {
  text-align: center;
  color: #777;
  font-size: 1rem;
}

/* 3 cards per row */
.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

/* Responsive fallback */
@media (max-width: 900px) {
  .restaurant-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .restaurant-grid {
    grid-template-columns: 1fr;
  }
}
</style>
