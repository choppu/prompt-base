<template>
  <header class="pbase__header">
    <div class="pbase__logo-container">
      <a class="pbase__logo" @click="handleRoot('home')">
        <img src="../assets/img/logo.png" class="pbase__logo-img" />
        <span class="pbase__logo-text">PromptBase</span>
      </a>
    </div>
    <div class="pbase__menu-container">
      <a @click="handleRoot('home')" class="pbase__menu-link">
        <span class="material-symbols-outlined pbase__icon">imagesmode</span>
        <span class="pbase__menu-link-text">Gallery</span>
      </a>
      <a @click="handleRoot('metadata-viewer')" class="pbase__menu-link">
        <span class="material-symbols-outlined pbase__icon">code_blocks</span>
        <span class="pbase__menu-link-text">Metadata Viewer</span>
      </a>
      <a @click="handleRoot('about')" class="pbase__menu-link">
        <span class="material-symbols-outlined pbase__icon">chat</span>
        <span class="pbase__menu-link-text">About</span>
      </a>
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
  box-shadow: var(--menu-box-shadow);
  background-color: var(--background-color-transparent);
  backdrop-filter: var(--blur-effect);
  position: sticky;
  z-index: 33;
  height: 100px;
  top: 0px;
}

.pbase__logo-container {
  width: 20%;
}

.pbase__logo {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  font-family: var(--font-heading);
  font-size: var(--h2-size);
  border: none;
}

.pbase__logo-img {
  width: 35px;
  height: 35px;
}

.pbase__menu-container {
  width: 320px;
  flex-grow: 320px;
  background-color: var(--text-color);
  color: var(--background-color);
  font-family: var(--font-heading);
  font-size: var(--heading-text-small);
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  border-radius: var(--container-border-radius);
  box-shadow: var(--menu-box-shadow);
  gap: 10px;
}

.pbase__icon {
  font-size: var(--h2-size);
}

.pbase__menu-link {
  padding-bottom: 0.5px;
  border-bottom: solid 1px transparent;
  box-sizing: border-box;
  cursor: pointer;
  color: var(--background-color);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 3px;
  align-items: center;
  box-sizing: border-box;
}

.pbase__menu-link-text {
  line-height: var(--text-line-heigth-14);
  font-weight: var(--text-bold);
}

.pbase__menu-link:hover {
  border-bottom: solid 1px var(--background-color);
}

@media only screen and (max-width: 600px) {
  .pbase__header {
    width: 100%;
    flex-direction: column;
    height: fit-content;
    padding: 0;
  }

  .pbase__logo-container {
    width: 100%;
    margin: 20px 0;
    box-sizing: border-box;
  }

  .pbase__logo {
    justify-content: center;
  }

  .pbase__menu-container {
    width: 100%;
    flex-wrap: wrap;
    border-radius: 0;
  }
}
</style>
