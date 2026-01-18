<template>
  <section class="restaurant-list">
    <h2 class="page-title">Restaurants List</h2>
    <!-- FILTER BAR -->
    <div class="filter-bar">
      <!-- City -->
      <select v-model="selectedCity">
        <option value="">All Cities</option>
        <option
          v-for="city in uniqueCities"
          :key="city"
          :value="city"
        >
          {{ city }}
        </option>
      </select>

      <!-- Cuisine -->
      <select v-model="selectedCuisine">
        <option value="">All Cuisines</option>
        <option
          v-for="cuisine in uniqueCuisines"
          :key="cuisine"
          :value="cuisine"
        >
          {{ cuisine }}
        </option>
      </select>

      <!-- Rating -->
      <label class="rating-filter">
        <input type="checkbox" v-model="highRatingOnly" />
        Rating ≥ 4.5
      </label>
    </div>


    <p v-if="loading" class="loading">Loading restaurants...</p>

    <div v-else class="restaurant-container">
      <!-- use RestaurantCard subcomponent -->
      <RestaurantCard
        v-for="restaurant in filteredRestaurants"
        :key="restaurant.id"
        :restaurant="restaurant"
        @delete="deleteRestaurant"
        @toggle-favorite="toggleFavorite"
        @update="updateRestaurant"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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

const selectedCity = ref('')
const selectedCuisine = ref('')
const highRatingOnly = ref(false)


// UNIQUE VALUES (Filter)
const uniqueCities = computed(() => {
  return [...new Set(restaurants.value.map(r => r.city))].sort()
})

const uniqueCuisines = computed(() => {
  return [...new Set(restaurants.value.map(r => r.cuisineType))].sort()
})


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
  }}

  //Add Filter
  const filteredRestaurants = computed(() => {

    return restaurants.value.filter(r => {
      const matchesCity =
        !selectedCity.value || r.city === selectedCity.value

      const matchesCuisine =
        !selectedCuisine.value || r.cuisineType === selectedCuisine.value

      const matchesRating =
        !highRatingOnly.value || r.rating >= 4.5

      return matchesCity && matchesCuisine && matchesRating
    })
  })

//Add Function edit
async function updateRestaurant(updated: {
  id: number
  cuisineType: string
  rating: number
  reviews: string[]
}) {
  try {
    const response = await fetch(`${API_URL}/${updated.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updated)
    })

    const savedRestaurant: Restaurant = await response.json()

    // update local state
    const index = restaurants.value.findIndex(r => r.id === updated.id)

    if (index === -1) {
      console.error('Restaurant not found in local state', updated.id)
      return
    }


    restaurants.value[index] = {
      id: savedRestaurant.id,
      name: savedRestaurant.name,
      country: savedRestaurant.country,
      city: savedRestaurant.city,
      favorite: savedRestaurant.favorite,
      cuisineType: savedRestaurant.cuisineType,
      rating: savedRestaurant.rating,
      reviews: savedRestaurant.reviews
    }
  } catch (error) {
    console.error('Error updating restaurant:', error)
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

/* Filter */
.filter-bar {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-bar select {
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #fff;
}

.rating-filter {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  color: #333;
}
</style>
