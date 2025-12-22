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
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  min-height: 600px;
  position: relative;
}

@media only screen and (max-width: 480px) {
  .pbase__main-container {
    height: 100vh;
    overflow: scroll;
  }
}
</style>
