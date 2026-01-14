<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">All Restaurants</RouterLink>
      <RouterLink to="/add">Add Restaurant</RouterLink>
    </nav>
  </header>

  <main class="app-main">
    <RouterView />
  </main>
</template>


<style scoped>
.app-header {
  padding: 1.5rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

nav a {
  text-decoration: none;
  color: #1f7a63;
  font-weight: 500;
}

nav a.router-link-exact-active {
  font-weight: 700;
  border-bottom: 2px solid #1f7a63;
}

.app-main {
  padding: 2rem;
}
</style>
