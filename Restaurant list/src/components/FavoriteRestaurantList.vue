<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RestaurantCard from '@/components/RestaurantCard.vue'

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

const API_URL = 'https://htw-webtech-backend-vvi9.onrender.com/restaurants'

const favorites = ref<Restaurant[]>([])
const loading = ref(true)

/**
 * Load all restaurants and filter favorites
 */
async function loadFavorites() {
  loading.value = true
  try {
    const response = await fetch(API_URL)
    const allRestaurants: Restaurant[] = await response.json()

    favorites.value = allRestaurants.filter(r => r.favorite === true)
  } catch (error) {
    console.error('Error loading favorite restaurants:', error)
  } finally {
    loading.value = false
  }
}

/**
 * Called when favorite state changes in RestaurantCard
 */
function refreshFavorites() {
  loadFavorites()
}

/**
 * Delete restaurant (also removes it from favorites automatically)
 */
async function deleteRestaurant(id: number) {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    favorites.value = favorites.value.filter(r => r.id !== id)
  } catch (error) {
    console.error('Error deleting restaurant:', error)
  }
}

onMounted(loadFavorites)
</script>

<template>
  <section class="favorite-restaurant-list">
  <h2>❤️ Favorite Restaurants ❤️</h2>

  <p v-if="loading" class="loading">
    Loading favorite restaurants...
  </p>

  <p v-else-if="favorites.length === 0" class="empty">
    No favorite restaurants yet.
  </p>

  <div v-else class="restaurant-container">
    <RestaurantCard
      v-for="restaurant in favorites"
      :key="restaurant.id"
      :restaurant="restaurant"
      @delete="deleteRestaurant"
      @toggle-favorite="refreshFavorites"
    />
  </div>
  </section>
</template>

<style scoped>
.favorite-restaurant-list {
  padding: 3rem 1rem;
}

.favorite-restaurant-list h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #7a3e1d;
}

.loading,
.empty {
  text-align: center;
  font-size: 1rem;
  color: #666;
}

.restaurant-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

/* Responsive fallback */
@media (max-width: 1024px) {
  .restaurant-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .restaurant-container {
    grid-template-columns: 1fr;
  }
}
</style>
