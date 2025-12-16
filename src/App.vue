<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
</script>
<template>
  <AppHeader />
  <main class="pbase__main-container">
    <RouterView />
  </main>
</template>
<style scoped>
@import './assets/css/base.css';
.pbase__main-container {
  width: 98%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
</style>
