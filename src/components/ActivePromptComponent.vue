<template>
  <div class="pbase__active-prompt-container">
    <div class="pbase__prompt-container">
      <img :src="imageDataToURL(props.activePrompt.image)" class="pbase__prompt-image" />
      <div class="pbase__active-prompt-context-container">
        <h3 class="pbase__active-prompt-heading">{{ props.activePrompt.name }}</h3>
        <div class="pbase__prompt-context-container">
          <div class="pbase__prompt-field-container">
            <p
              v-if="props.activePrompt.prompts"
              class="pbase__prompt-field"
              ref="selected-prompt"
              contentEditable="false"
              @click="makeEditable"
            >
              {{
                props.activePrompt.prompts[selectedPromptType]
                  ? props.activePrompt.prompts[selectedPromptType]
                  : 'Change me...'
              }}
            </p>
          </div>
          <div class="pbase__action-btns-container">
            <button class="pbase__action-btn" @click="copyToClipboard()">
              <span class="material-symbols-outlined pbase__icon">content_copy</span>
              <span>Copy</span>
            </button>
            <button class="pbase__action-btn" @click="updatePrompt">
              <span class="material-symbols-outlined pbase__icon">check</span>
              <span>Save</span>
            </button>
          </div>
        </div>
        <div class="pbase__prompt-variants-container">
          <div v-if="props.activePrompt.prompts" class="pbase__prompt-variant-container">
            <div
              v-for="promptType in Object.keys(props.activePrompt.prompts)"
              :key="promptType"
              @click="updateSelectedPromptType(promptType)"
              class="pbase__prompt-variant"
            >
              {{ promptType }}
              <span class="material-symbols-outlined pbase__prompt-variant-separator">
                horizontal_rule</span
              >
            </div>
          </div>
          <div class="pbase__new-prompt-variant-name-container">
            <span class="pbase__new-prompt-variant-name" ref="new-variant-name"></span>
          </div>
          <span class="pbase__add-btn-container" @click="addNewPromptVariant">
            <span class="material-symbols-outlined pbase__icon">library_add</span>
            <span>Add new prompt variant</span>
          </span>
        </div>
        <div class="pbase__tags-list">
          <TagList :tags="props.activePrompt.tags" />
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
const emit = defineEmits(['close'])
const selectedPromptText = useTemplateRef('selected-prompt')
const selectedPromptType = ref("ZIT")
const newVariantName = useTemplateRef('new-variant-name')

function addNewPromptVariant(): void {
  newVariantName.value!.innerHTML = 'Prompt Variant 1'
  selectedPromptType.value = newVariantName.value!.innerText
}

function imageDataToURL(img: Uint8Array<ArrayBuffer>): string {
  return URL.createObjectURL(new Blob([img], { type: 'image/png' }))
}

function closeActivePrompt(): void {
  emit('close')
}

function updateSelectedPromptType(t: string): void {
  selectedPromptType.value = t
}

function makeEditable(): void {
  ;(selectedPromptText.value as HTMLParagraphElement).contentEditable = 'true'
}

async function updatePrompt(): Promise<void> {
  const updatedPrompts = {
    ...props.activePrompt.prompts,
    [selectedPromptType.value as string]: selectedPromptText.value?.innerHTML,
  }
  const updatedPrompt = { ...props.activePrompt, prompts: updatedPrompts }
  updatedPrompt.tags = toRaw(updatedPrompt.tags)
  await DB.putPrompt(updatedPrompt)
  ;(selectedPromptText.value as HTMLParagraphElement).contentEditable = 'false'
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
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 20px;
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

.pbase__action-btns-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  padding: 5px;
  box-sizing: border-box;
}

.pbase__action-btn {
  width: max-content;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 3px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background-color: var(--secondary-color);
  padding: 5px 8px;
  box-sizing: border-box;
  color: var(--text-color);
  font-family: var(--font-main);
  font-size: var(--text-small);
  font-weight: var(--text-weight-200);
  border-radius: 6px;
  border: none;
}

.pbase__action-btn:disabled {
  background-color: var(--secondary-color-brighter);
}

.pbase__icon {
  font-size: var(--h2-size);
}

.pbase__icon-close {
  margin-top: 10px;
  rotate: 52deg;
}

.pbase__prompt-field-container {
  max-height: 300px;
  overflow-y: scroll;
  padding: 0 0 10px 0;
  cursor: default;
}

.pbase__prompt-field {
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  min-height: min-content;
  height: auto;
  outline: none;
  font-size: var(--text-medium);
  padding: 5px;
  box-sizing: border-box;
}

.pbase__prompt-field:focus {
  background-color: var(--secondary-color-darker);
}

.pbase__active-prompt-heading {
  font-family: var(--font-heading);
  font-size: var(--h1-size);
  font-weight: var(--text-bold);
  padding: 10px 5px;
  box-sizing: border-box;
}

.pbase__prompt-variants-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 5px;
  box-sizing: border-box;
  font-size: var(--text-small);
  line-height: var(--text-line-heigth-16);
}

.pbase__prompt-variant-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;
  padding: 0;
}

.pbase__prompt-variant {
  border-bottom: dashed 1px var(--background-color);
  cursor: pointer;
}

.pbase__prompt-variant-separator {
  rotate: -90deg;
  font-size: var(--h1-size);
  display: inline-block;
  background-color: red;
}

.pbase__add-btn-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  font-weight: var(--text-bold);
  word-spacing: -2px;
}
</style>
