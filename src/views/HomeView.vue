<script setup lang="ts">
import PromptList from '../components/PromptList.vue'
</script>
<template>
  <div class="pbase__prompts-container">
    <PromptList />
  </div>
</template>
<style scoped>
@import '../assets/css/base.css';
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
