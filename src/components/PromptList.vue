<template>
  <div>
    <div v-for="prompt in prompts" :key="prompt.id" class="pbase__prompt-container">
      <div class="pbase__relative-container">
        <div class="pbase__prompt-context-container">
          <p>{{ prompt.naturalPrompt }}</p>
          <ul>
            <li v-for="tag in prompt.tags" :key="tag">{{ tag }}</li>
          </ul>
        </div>
        <img :src="imageDataToURL(prompt.image)" class="pbase__prompt-image" />
      </div>
      <h3 class="pbase__prompt-heading">{{ prompt.name }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { liveQuery } from 'dexie'
import { from, useObservable } from '@vueuse/rxjs'
import * as DB from '../data/db'

const prompts = useObservable(from(liveQuery(DB.getPrompts)))

function imageDataToURL(img: Uint8Array<ArrayBuffer>): string {
  return URL.createObjectURL(new Blob([img], { type: 'image/png' }))
}
</script>
<style scoped>
@import '../assets/css/base.css';

.pbase__prompt-container {
  display: flex;
  flex-direction: column;
  max-width: 350px;
  flex-basis: 350px;
  background: var(--background-white);
}

.pbase__prompt-heading {
  color: var(--secondary-color);
  font-weight: var(--text-bold);
  font-family: var(--font-heading);
  padding: 30px 10px;
  box-sizing: border-box;
  height: 100px;
}

.pbase__relative-container {
  position: relative;
}

.pbase__prompt-context-container {
  position: absolute;
  opacity: 0;
}

.pbase__prompt-image {
  width: 100%;
}
</style>
