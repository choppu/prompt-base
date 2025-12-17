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
  width: 25vw;
  max-width: 350px;
  flex-grow: 350px;
  flex-basis: 25vw;
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
</style>
