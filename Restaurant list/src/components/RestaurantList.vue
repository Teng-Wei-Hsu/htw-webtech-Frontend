<template>
  <section class="restaurant-list">
    <h2 class="page-title">Restaurants List</h2>

    <!-- Shared Edit Form (appears only when editing) -->
    <div v-if="editingId !== null" class="edit-form">
      <h3>Edit Restaurant: {{ editingRestaurant?.name || 'Loading...' }}</h3>

      <div class="form-grid">
        <label>
          Cuisine Type
          <input v-model="editForm.cuisineType" />
        </label>

        <label>
          Rating
          <input type="number" step="0.1" min="0" max="5" v-model.number="editForm.rating" />
        </label>

        <label>
          Reviews (comma separated)
          <textarea v-model="editReviewsText"></textarea>
        </label>
      </div>

      <div class="form-actions">
        <button
          class="save-btn"
          :disabled="!hasChanges || isSaving"
          @click="saveEdit"
        >
          {{ isSaving ? 'Saving...' : 'Update' }}
        </button>
        <button class="cancel-btn" :disabled="isSaving" @click="cancelEdit">
          Cancel
        </button>
      </div>
    </div>

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
        @edit="startEdit"
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

// Edit state
const editingId = ref<number | null>(null)
const editForm = ref({
  cuisineType: '',
  rating: 0,
  reviews: [] as string[]
})
const isSaving = ref(false)

const editingRestaurant = computed(() =>
  restaurants.value.find(r => r.id === editingId.value) || null
)

// Computed for reviews text
const editReviewsText = computed({
  get: () => editForm.value.reviews.join(', '),
  set: (value: string) => {
    editForm.value.reviews = value.split(',').map(r => r.trim()).filter(Boolean)
  }
})

const hasChanges = computed(() => {
  const original = restaurants.value.find(r => r.id === editingId.value)
  if (!original) return false

  return (
    editForm.value.cuisineType !== original.cuisineType ||
    editForm.value.rating !== original.rating ||
    editForm.value.reviews.join(',') !== original.reviews.join(',')
  )
})

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

// Start editing
function startEdit(restaurant: any) {
  editingId.value = restaurant.id
  editForm.value = {
    cuisineType: restaurant.cuisineType,
    rating: restaurant.rating,
    reviews: [...restaurant.reviews]
  }
}

// Save changes
async function saveEdit() {
  if (editingId.value === null) return

  isSaving.value = true

  const payload = {
    id: editingId.value,
    cuisineType: editForm.value.cuisineType,
    rating: editForm.value.rating,
    reviews: editForm.value.reviews
  }

  try {
    await updateRestaurant(payload)
    cancelEdit()
  } catch (error) {
    console.error('Save failed:', error)
    alert('Failed to update restaurant. Please try again.')
  } finally {
    isSaving.value = false
  }
}

function cancelEdit() {
  editingId.value = null
  editForm.value = { cuisineType: '', rating: 0, reviews: [] }
}

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })

    if (!response.ok) throw new Error('Update failed')

    const savedRestaurant: Restaurant = await response.json()

    const index = restaurants.value.findIndex(r => r.id === updated.id)
    if (index !== -1) {
      restaurants.value[index] = savedRestaurant
    }
  } catch (error) {
    console.error('Error updating restaurant:', error)
    throw error // rethrow for saveEdit to catch
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

.edit-form {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.edit-form h3 {
  margin-top: 0;
  color: #1f7a63;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-grid input,
.form-grid textarea {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.form-actions {
  margin-top: 1.2rem;
  display: flex;
  gap: 1rem;
}

.save-btn {
  background: #1f7a63;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}

.save-btn:disabled {
  opacity: 0.6;
}

.cancel-btn {
  background: #ccc;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>
