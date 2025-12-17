<template>
  <div :class="activePromptContainerClass(props.activePrompt.state)">
    <div class="pbase__prompt-container">
      <img :src="imageDataToURL(props.activePrompt.prompt.image)" class="pbase__prompt-image" />
      <div class="pbase__active-prompt-context-container">
        <h3 class="pbase__active-prompt-heading">{{ props.activePrompt.prompt.name }}</h3>
        <div class="pbase__prompt-context-container">
          <p class="pbase__prompt-field" ref="selected-prompt" contentEditable="false">
            {{
              props.activePrompt.prompt.prompts
                ? props.activePrompt.prompt.prompts[selectedPromptType]
                : ''
            }}
          </p>
          <span class="material-symbols-outlined pbase__icon" @click="copyToClipboard()"
            >content_copy</span
          >
          <span class="material-symbols-outlined pbase__icon" @click="makeEditable"
            >edit_square</span
          >
          <span class="material-symbols-outlined pbase__icon" @click="updatePrompt">check</span>
        </div>
        <div v-if="props.activePrompt.prompt.prompts">
          <div
            v-for="promptType in Object.keys(props.activePrompt.prompt.prompts)"
            :key="promptType"
            @click="updateSelectedPromptType(promptType)"
          >
            {{ promptType }}
          </div>
        </div>
        <div class="pbase__tags-list">
          <TagList :tags="props.activePrompt.prompt.tags" />
        </div>
      </div>
    </div>
    <div class="pbase__icon-close-container">
      <span class="material-symbols-outlined pbase__icon-close" @click="closeActivePrompt()"
        >close</span
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, toRaw, useTemplateRef } from 'vue'
import TagList from './TagComponent.vue'
import * as DB from '@/data/db'

const props = defineProps(['activePrompt'])
const emit = defineEmits(['activeStateChange'])
const selectedPromptText = useTemplateRef('selected-prompt')
const selectedPromptType = ref(props.activePrompt.defaultPromptType)

const activePromptContainerClass = (state: boolean): string => {
  return state ? 'pbase__active-prompt-container' : 'pbase__active-prompt-container-close'
}

function imageDataToURL(img: Uint8Array<ArrayBuffer>): string {
  return URL.createObjectURL(new Blob([img], { type: 'image/png' }))
}

function closeActivePrompt(): void {
  emit('activeStateChange')
}

function updateSelectedPromptType(t: string): void {
  selectedPromptType.value = t
}

function makeEditable(): void {
  ;(selectedPromptText.value as HTMLParagraphElement).contentEditable = 'true'
}

async function updatePrompt(): Promise<void> {
  const updatedPrompts = {
    ...props.activePrompt.prompt.prompts,
    [selectedPromptType.value as string]: selectedPromptText.value?.innerHTML,
  }
  const updatedPrompt = { ...props.activePrompt.prompt, prompts: updatedPrompts }
  updatedPrompt.tags = toRaw(updatedPrompt.tags)
  await DB.putPrompt(updatedPrompt)
}

async function copyToClipboard(): Promise<void> {
  await navigator.clipboard.writeText(selectedPromptText.value?.innerText as string)
}
</script>
<style scoped>
@import '../assets/css/base.css';

.pbase__active-prompt-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: calc(100vh - 100px);
  margin-top: 100px;
  background-color: var(--background-color-semitransparent);
  backdrop-filter: var(--blur-effect);
}

.pbase__active-prompt-container-close {
  display: none;
}

.pbase__prompt-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 70%;
  max-width: 1000px;
  flex-grow: 1000px;
  flex-basis: 1000px;
  height: min-content;
  background: var(--background-white);
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
  gap: 30px;
  align-self: center;
}

.pbase__prompt-image {
  width: 320px;
  height: min-content;
  box-shadow: var(--box-shadow);
}

.pbase__active-prompt-context-container {
  color: var(--background-color);
  width: calc(100% - 350px);
}

.pbase__icon-close-container {
  width: 50px;
  height: 80px;
  box-sizing: border-box;
  border-left: solid 1px var(--text-color);
  position: absolute;
  right: 10px;
  top: -15px;
  rotate: -52deg;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.pbase__icon-close {
  margin-top: 10px;
  rotate: 52deg;
}

.pbase__prompt-field {
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  min-height: min-content;
  height: auto;
  max-height: 300px;
  outline: none;
}
</style>
