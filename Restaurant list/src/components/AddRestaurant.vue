<template>
  <section class="add-restaurant">
    <h2>Add New Restaurant</h2>

    <form @submit.prevent="submitForm">
      <input
        v-model="restaurant.name"
        placeholder="Restaurant Name"
        required
      />

      <input
        v-model="restaurant.country"
        placeholder="Country"
        required
      />

      <input
        v-model="restaurant.city"
        placeholder="City"
        required
      />

      <input
        v-model="restaurant.cuisineType"
        placeholder="Cuisine Type"
        required
      />

      <input
        v-model.number="restaurant.rating"
        type="number"
        min="1"
        max="5"
        step="0.1"
        placeholder="Rating (1–5)"
        required
      />

      <textarea
        v-model="reviewsText"
        placeholder="Reviews (comma separated)"
      ></textarea>

      <button type="submit">Add Restaurant</button>
    </form>

    <p v-if="success" class="success">Restaurant added successfully.</p>
    <p v-if="error" class="error">Error adding restaurant.</p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const API_URL = 'https://htw-webtech-backend-vvi9.onrender.com/restaurants'

const restaurant = ref({
  name: '',
  country: '',
  city: '',
  cuisineType: '',
  rating: 5,
  reviews: [] as string[]
})

const reviewsText = ref('')
const success = ref(false)
const error = ref(false)

async function submitForm() {
  success.value = false
  error.value = false

  restaurant.value.reviews = reviewsText.value
    .split(',')
    .map(r => r.trim())
    .filter(r => r.length > 0)

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(restaurant.value)
    })

    success.value = true

    restaurant.value = {
      name: '',
      country: '',
      city: '',
      cuisineType: '',
      rating: 5,
      reviews: []
    }
    reviewsText.value = ''
  } catch (e) {
    error.value = true
  }
}
</script>

<style scoped>
.add-restaurant {
  max-width: 500px;
  margin: 2rem auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

input,
textarea {
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  padding: 0.7rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #369f6e;
}

.success {
  color: green;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
