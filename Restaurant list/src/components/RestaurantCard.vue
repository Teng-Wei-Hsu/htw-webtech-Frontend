<template>
  <div class="restaurant-card">
    <h3>{{ restaurant.name }}</h3>

    <p>
      <strong>Location:</strong>
      {{ restaurant.city }}, {{ restaurant.country }}
    </p>

    <p><strong>Cuisine:</strong> {{ restaurant.cuisineType }}</p>

    <p><strong>Rating:</strong> ⭐ {{ restaurant.rating }}</p>

    <div class="reviews">
      <strong>Reviews:</strong>
      <ul>
        <li
          v-for="(review, index) in restaurant.reviews"
          :key="index"
        >
          "{{ review }}"
        </li>
      </ul>
    </div>
    <!-- NEW: Delete button -->
    <button class="delete-btn" @click="emitDelete">
      Delete
    </button>
  </div>
</template>

<script setup lang="ts">
interface Restaurant {
  id: number
  name: string
  country: string
  city: string
  cuisineType: string
  rating: number
  reviews: string[]
}

const props = defineProps<{
  restaurant: Restaurant
}>()

// declare events we emit
const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()

// function to emit the delete event
function emitDelete() {
  emit('delete', props.restaurant.id)
}
</script>

<style scoped>
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

.delete-btn {
  margin-top: 1rem;
  padding: 8px 12px;
  background-color: #e63946;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #d62828;
}
</style>
