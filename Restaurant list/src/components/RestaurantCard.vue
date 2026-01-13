<template>
  <div class="restaurant-card">
    <!-- Header -->
    <div class="card-header">
      <h3>{{ restaurant.name || 'Unnamed Restaurant' }}</h3>

      <div class="actions">
        <span class="rating">⭐ {{ restaurant.rating || 'N/A' }}</span>

        <!-- Favorite button -->
        <button class="favorite-btn" @click="emitFavorite">
          {{ restaurant.favorite ? '❤️' : '🤍' }}
        </button>
      </div>
    </div>

    <!-- Meta info -->
    <p class="location">
      {{ restaurant.city || 'N/A' }}, {{ restaurant.country || 'N/A' }}
    </p>

    <p class="cuisine">
      {{ restaurant.cuisineType || 'N/A' }} Cuisine
    </p>

    <!-- Reviews -->
    <div class="reviews">
      <strong>Reviews:</strong>

      <ul v-if="restaurant.reviews && restaurant.reviews.length > 0">
        <li v-for="(review, index) in restaurant.reviews" :key="index">
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
  id?: number
  name: string
  country: string
  city: string
  cuisineType: string
  rating: number
  reviews: string[]
  favorite?: boolean   // NEW (optional)
}

const props = defineProps<{
  restaurant: Restaurant
}>()

const emit = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'toggle-favorite', id: number): void
}>()

function emitDelete() {
  if (props.restaurant.id === undefined) {
    console.warn('Cannot delete: restaurant has no id!', props.restaurant)
    alert('Cannot delete: missing restaurant ID')
    return
  }

  emit('delete', props.restaurant.id)
}

function emitFavorite() {
  if (props.restaurant.id === undefined) {
    console.warn('Cannot favorite: restaurant has no id!', props.restaurant)
    return
  }

  emit('toggle-favorite', props.restaurant.id)
}
</script>

<style scoped>
.restaurant-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: left;
}

.restaurant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #1f7a63;
  font-size: 1.3rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.rating {
  font-size: 0.95rem;
  color: #333;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
}

.favorite-btn:hover {
  transform: scale(1.15);
}

.location {
  margin: 0.4rem 0;
  color: #555;
  font-size: 0.95rem;
}

.cuisine {
  margin-bottom: 0.8rem;
  font-weight: 500;
  color: #333;
}

.reviews {
  font-size: 0.9rem;
  color: #444;
}

.reviews ul {
  margin-top: 0.4rem;
  padding-left: 1.2rem;
}

.delete-btn {
  margin-top: 1.2rem;
  padding: 0.6rem;
  width: 100%;
  background-color: #e63946;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #d62828;
}

</style>
