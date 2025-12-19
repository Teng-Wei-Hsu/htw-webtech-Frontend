<template>
  <div class="restaurant-card">
    <h3>{{ restaurant.name || 'Unnamed Restaurant' }}</h3>

    <p>
      <strong>Location:</strong>
      {{ restaurant.city || 'N/A' }}, {{ restaurant.country || 'N/A' }}
    </p>

    <p><strong>Cuisine:</strong> {{ restaurant.cuisineType || 'N/A' }}</p>

    <p><strong>Rating:</strong> ⭐ {{ restaurant.rating || 'N/A' }}</p>

    <div class="reviews">
      <strong>Reviews:</strong>
      <ul v-if="restaurant.reviews && restaurant.reviews.length > 0">
        <li
          v-for="(review, index) in restaurant.reviews"
          :key="index"
        >
          "{{ review }}"
        </li>
      </ul>
      <p v-else>No reviews yet</p>
    </div>

    <!-- Delete button -->
    <button class="delete-btn" @click="emitDelete">
      Delete
    </button>
  </div>
</template>

<script setup lang="ts">
interface Restaurant {
  id?: number          // Make id optional to avoid undefined errors
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

const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()

// Safe delete – check if id exists
function emitDelete() {
  if (props.restaurant.id === undefined) {
    console.warn('Cannot delete: restaurant has no id!', props.restaurant)
    alert('Cannot delete: missing restaurant ID')
    return
  }

  console.log('Emitting delete for restaurant ID:', props.restaurant.id)
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
