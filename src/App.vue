<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import Footer from './components/FooterComponent.vue'
</script>
<template>
  <AppHeader />
  <main class="pbase__main-container">
    <RouterView />
  </main>
  <Footer />
</template>
<style scoped>
@import './assets/css/base.css';
.pbase__main-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
</style>
