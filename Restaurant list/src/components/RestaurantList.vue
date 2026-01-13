<template>
  <section class="restaurant-list">
    <h2>Our Top Restaurants</h2>


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
  margin-top: 2rem;
}

.restaurant-list h2 {
  font-size: 1.6rem;
  color: #1f7a63;
  margin-bottom: 1.5rem;
  text-align: left;
}

.loading {
  color: #777;
  text-align: center;
}

.restaurant-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
</style>
