<template>
  <div class="pbase__prompt-container">
    <div class="pbase__relative-container">
      <div class="pbase__prompt-context-container">
        <p ref="prompt-to-copy">{{ props.prompt.naturalPrompt }}</p>
        <span class="material-symbols-outlined pbase__icon" @click="copyToClipboard()"
          >content_copy</span
        >
      </div>
      <img :src="imageDataToURL(prompt.image)" class="pbase__prompt-image" />
    </div>
    <div class="pbase__prompt-bottom">
      <h3 class="pbase__prompt-heading">{{ props.prompt.name }}</h3>
      <div class="pbase__tags-list">
        <Tag :tags="props.prompt.tags" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Tag from './TagComponent.vue'

const props = defineProps(['prompt'])
const promptText = useTemplateRef('prompt-to-copy')

async function copyToClipboard(): Promise<void> {
  await navigator.clipboard.writeText(promptText.value?.innerText as string)
}

function imageDataToURL(img: Uint8Array<ArrayBuffer>): string {
  return URL.createObjectURL(new Blob([img], { type: 'image/png' }))
}
</script>
<style scoped>
@import '../assets/css/base.css';
.pbase__prompt-container {
  display: flex;
  flex-direction: column;
  width: calc(20vw - 20px);
  max-width: 350px;
  flex-grow: 350px;
  flex-basis: calc(20vw - 20px);
  background: var(--background-white);
  padding: 15px 20px 0 20px;
  box-sizing: border-box;
  margin: 8px 4px;
}

.pbase__prompt-bottom {
  width: 100%;
  padding: 20px 10px;
  box-sizing: border-box;
  height: 100px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
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

.pbase__prompt-context-container {
  position: absolute;
  opacity: 1;
  background-color: var(--background-color-transparent);
  bottom: 5px;
  height: 170px;
  font-size: var(--text-small);
  padding: 10px;
  box-sizing: border-box;
  line-height: var(--text-line-heigth-20);
  width: 100%;
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
