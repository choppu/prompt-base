<script setup lang="ts">
import PromptList from './components/PromptList.vue'
</script>
<template>
  <main class="pbase__main-container">
    <div class="pbase__prompts-container">
      <PromptList />
    </div>
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

.pbase__prompts-container {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
</style>
