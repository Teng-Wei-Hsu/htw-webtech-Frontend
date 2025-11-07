<template>
  <section class="restaurant-list">
    <h2>Our Top Restaurants</h2>

    <!-- Show loading text while data is being fetched -->
    <p v-if="loading" class="loading">Loading restaurants...</p>

    <!-- If there are restaurants, render them -->
    <div v-else class="restaurant-container">
      <div
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        class="restaurant-card"
      >
        <h3>{{ restaurant.name }}</h3>
        <p>
          <strong>Location:</strong> {{ restaurant.city }}, {{ restaurant.country }}
        </p>
        <p><strong>Cuisine:</strong> {{ restaurant.cuisineType }}</p>
        <p><strong>Rating:</strong> ⭐ {{ restaurant.rating }}</p>

        <div class="reviews">
          <strong>Reviews:</strong>
          <ul>
            <li v-for="(review, index) in restaurant.reviews" :key="index">
              "{{ review }}"
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Define types (TypeScript)
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

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:8080/restaurants')
    restaurants.value = await response.json()
  } catch (error) {
    console.error('Error fetching restaurants:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.restaurant-list {
  margin-top: 2rem;
}

h2 {
  color: var(--color-heading, #42b983);
  margin-bottom: 1rem;
}

.loading {
  font-style: italic;
  color: gray;
}

.restaurant-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.restaurant-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1.5rem;
  background: #fafafa;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.restaurant-card:hover {
  transform: translateY(-5px);
}

.reviews {
  margin-top: 1rem;
  text-align: left;
}

.reviews ul {
  margin-top: 0.3rem;
  padding-left: 20px;
  list-style-type: disc;
}
</style>
