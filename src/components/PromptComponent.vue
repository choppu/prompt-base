<template>
  <div class="pbase__prompt-container" @click="emit('prompt-selected', props.prompt)">
    <div class="pbase__relative-container">
      <img :src="imageDataToURL(props.prompt.image)" class="pbase__prompt-image" />
    </div>
    <div class="pbase__prompt-bottom">
      <h3 class="pbase__prompt-heading">{{ props.prompt.name }}</h3>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps(['prompt'])
const emit = defineEmits(['prompt-selected'])

function imageDataToURL(img: Uint8Array<ArrayBuffer>): string {
  return URL.createObjectURL(new Blob([img], { type: 'image/png' }))
}
</script>
<style scoped>
@import '../assets/css/base.css';
.pbase__prompt-container {
  display: flex;
  flex-direction: column;
  width: calc(25% - 8px);
  max-width: calc(25% - 8px);
  flex-basis: calc(25% - 8px);
  background: var(--background-white);
  padding: 15px 20px 0 20px;
  box-sizing: border-box;
}

.pbase__prompt-bottom {
  width: 100%;
  padding: 20px 10px;
  box-sizing: border-box;
  height: 80px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.pbase__prompt-heading {
  width: 100%;
  color: var(--secondary-color);
  font-weight: var(--text-bold);
  font-family: var(--font-heading);
  font-size: var(--h3-size);
  box-sizing: border-box;
}

.pbase__tags-list {
  width: 100%;
  color: var(--background-color);
  font-size: var(--text-small);
  font-weight: var(--text-semibold);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
  box-sizing: border-box;
}

.pbase__relative-container {
  position: relative;
}

.pbase__icon {
  font-size: var(--icon-normal);
  cursor: pointer;
}

.pbase__icon:active,
.pbase__icon:focus,
.pbase__icon:hover {
  color: var(--secondary-color-darker);
}

.pbase__prompt-image {
  width: 100%;
  box-shadow: var(--box-shadow);
}

@media only screen and (min-width: 300px) and (max-width: 500px) {
  .pbase__prompt-container {
    width: 100%;
    max-width: 100%;
    flex-basis: 100%;
  }

  .pbase__prompt-image {
    width: 100%;
    max-width: 350px;
  }
}

@media only screen and (min-width: 501px) and (max-width: 900px) {
  .pbase__prompt-container {
    width: calc(33.33% - 4px);
    max-width: calc(33.33% - 4px);
    flex-basis: calc(33.33% - 4px);
  }
}

@media only screen and (min-width: 1800px) {
  .pbase__prompt-container {
    width: calc(12.5% - 7px);
    max-width: 350px;
    flex-basis: calc(12.5% - 7px);
  }
}

@media only screen and (min-width: 3000px) {
  .pbase__prompt-container {
    width: calc(12% - 7px);
    max-width: 332px;
    flex-basis: calc(12% - 7px);
  }
}
</style>
