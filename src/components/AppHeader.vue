<template>
  <header class="pbase__header">
    <div class="pbase__logo-container">
      <img src="../assets/img/logo.png" class="pbase__logo" @click="handleRoot('home')" />
    </div>
    <div class="pbase__menu-container">
      <span class="material-symbols-outlined pbase__icon">menu</span>
      <a @click="handleRoot('home')" class="pbase__menu-link">Home</a>
      <a @click="handleRoot('metadata-viewer')" class="pbase__menu-link">Metadata Viewer</a>
      <a @click="handleRoot('about')" class="pbase__menu-link">About</a>
    </div>
  </header>
</template>
<script setup lang="ts">
import router from '@/router'

const handleRoot = (name: string): void => {
  router.push({ name })
}
</script>
<style scoped>
@import '../assets/css/base.css';

.pbase__header {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  box-sizing: border-box;

  .pbase__logo-container {
    width: 20%;
  }

  .pbase__logo {
    width: 50px;
    height: 50px;
  }

  .pbase__menu-container {
    width: 320px;
    background-color: var(--text-color);
    color: var(--background-color);
    font-family: var(--font-heading);
    font-size: var(--text-small);
    padding: 8px 15px 8px 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    border-radius: 50px;
    box-shadow: var(--menu-box-shadow);
  }

  .pbase__icon {
    font-size: var(--text-medium);
    line-height: 30px;
    background-color: var(--secondary-color);
    color: var(--text-color);
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 30px;
  }

  .pbase__menu-link {
    padding-bottom: 0.5px;
    box-sizing: border-box;
    cursor: pointer;
    line-height: var(--text-line-heigth-14);
  }

  .pbase__menu-link:hover {
    border-bottom: solid 1px var(--background-color);
  }
}
</style>
