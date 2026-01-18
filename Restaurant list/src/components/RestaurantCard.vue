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

    <!-- Delete button & Edit button -->
    <div class="card-footer">
      <button class="edit-btn" @click.stop="openEdit">Edit</button>
      <button class="delete-btn" @click="emitDelete">Delete</button>
    </div>

    <div v-if="isEditing" class="modal-overlay">
      <div class="modal">
        <h3>Edit Restaurant</h3>

        <label>
          Cuisine Type
          <input v-model="editData.cuisineType" />
        </label>

        <label>
          Rating
          <input type="number" step="0.1" min="0" max="5" v-model.number="editData.rating" />
        </label>

        <label>
          Reviews (comma separated)
          <textarea v-model="editReviewsText"></textarea>
        </label>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>

        <div class="modal-actions">
          <button
            class="save-btn"
            :disabled="!hasChanges || isSaving"
            @click="saveEdit"
          >
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>

          <button
            class="cancel-btn"
            :disabled="isSaving"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

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
  favorite?: boolean   // NEW (optional)
}

const props = defineProps<{
  restaurant: Restaurant
}>()


import { ref, computed } from 'vue'

const isEditing = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')

const editData = ref({
  cuisineType: props.restaurant.cuisineType,
  rating: props.restaurant.rating,
  reviews: [...props.restaurant.reviews]
})

const editReviewsText = computed({
  get: () => editData.value.reviews.join(', '),
  set: (value: string) => {
    editData.value.reviews = value.split(',').map(r => r.trim())
  }
})

const hasChanges = computed(() => {
  return (
    editData.value.cuisineType !== props.restaurant.cuisineType ||
    editData.value.rating !== props.restaurant.rating ||
    editData.value.reviews.join(',') !== props.restaurant.reviews.join(',')
  )
})


const emit = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'toggle-favorite', id: number): void
  (e: 'update', payload: {
    id: number
    cuisineType: string
    rating: number
    reviews: string[]
  }): void
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

//Function for editing
function openEdit() {
  editData.value = {
    cuisineType: props.restaurant.cuisineType,
    rating: props.restaurant.rating,
    reviews: [...props.restaurant.reviews]
  }
  errorMessage.value = ''
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

async function saveEdit() {
  if (!props.restaurant.id) return

  isSaving.value = true
  errorMessage.value = ''

  try {
    emit('update', {
      id: props.restaurant.id,
      cuisineType: editData.value.cuisineType,
      rating: editData.value.rating,
      reviews: editData.value.reviews
    })

    isEditing.value = false
  } catch (e) {
    errorMessage.value = 'Failed to save changes. Please try again.'
  } finally {
    isSaving.value = false
  }
}


</script>

<style scoped>
.restaurant-card {
  display: flex;
  flex-direction: column;

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
  margin-top: 1rem;
  padding: 0.35rem 0.7rem;
  background-color: transparent;
  color: #b23a3a;
  border: 1px solid #e0b4b4;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  align-self: flex-end;
  width: auto;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background-color: #e63946;
  color: white;
  border-color: #e63946;
}


.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1rem;
}

.edit-btn {
  background: transparent;
  border: 1px solid #1f7a63;
  color: #1f7a63;
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: #1f7a63;
  color: white;
}


.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  width: 320px;
}

.modal label {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.8rem;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.save-btn {
  background: #1f7a63;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
}

.cancel-btn {
  background: #ccc;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
}

</style>
