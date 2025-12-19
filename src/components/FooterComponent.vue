<template>
  <footer class="pbase__footer-container">
    <span>&copy; {{ copyYear }} Bitgamma</span>
  </footer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const copyYear = ref(new Date().getFullYear())
</script>
<style scoped>
@import '../assets/css/base.css';
.pbase__footer-container {
  width: calc(100% - 80px);
  padding: 20px 10px;
  border-top: solid 1px var(--text-color);
  margin: 0 auto;
  font-size: var(--text-small);
  text-align: right;
  bottom: 0;
}
</style>
