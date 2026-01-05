<template>
  <div class="pbase__active-prompt-container">
    <div class="pbase__prompt-container">
      <img :src="imageDataToURL(props.activePrompt.image)" class="pbase__prompt-image" />
      <div class="pbase__active-prompt-context-container">
        <input
          type="text"
          class="pbase__active-prompt-heading"
          v-model="promptName"
          @change="updatePrompt"
        />
        <div class="pbase__prompt-variants-container">
          <h3 class="pbase__prompt-form-label">Prompt variants</h3>
          <div v-if="props.activePrompt.prompts" class="pbase__prompt-variant-container">
            <div
              v-for="promptType in Object.keys(props.activePrompt.prompts)"
              :key="promptType"
              @click="updateSelectedPromptType(promptType)"
              :class="isActiveElement(promptType)"
              class="pbase__prompt-variant"
            >
              {{ promptType }}
            </div>
          </div>
        </div>
        <div class="pbase__prompt-context-container">
          <div class="pbase__new-prompt-variant-name-container">
            <input
              v-if="addingNewVariant"
              v-model="selectedPromptType"
              class="pbase__new-prompt-variant-name"
            />
          </div>
          <h3 class="pbase__prompt-form-label">Prompt text</h3>
          <div class="pbase__prompt-field-container">
            <textarea
              v-if="props.activePrompt.prompts"
              v-model="selectedPromptText"
              class="pbase__prompt-field"
            >
            </textarea>
          </div>
        </div>
        <div class="pbase__action-btns-container">
          <button class="pbase__action-btn" @click="addNewPromptVariant" ref="btn-add">
            <span class="material-symbols-outlined pbase__icon">library_add</span>
            <span>Add prompt variant</span>
          </button>
          <button class="pbase__action-btn" @click="copyToClipboard">
            <span class="material-symbols-outlined pbase__icon">content_copy</span>
            <span>Copy</span>
          </button>
          <button class="pbase__action-btn" @click="updatePrompt">
            <span class="material-symbols-outlined pbase__icon">check</span>
            <span>Save</span>
          </button>
          <button class="pbase__action-btn pbase__btn-delete" @click="deletePromptVariant">
            <span class="material-symbols-outlined pbase__icon">delete</span>
            <span>Delete</span>
          </button>
        </div>
        <div class="pbase__prompt-tags-container">
          <h3 class="pbase__prompt-form-label">Tags</h3>
          <div v-if="props.activePrompt.tags" class="pbase__prompt-tags">
            <div class="pbase__prompt-tag" v-for="tag in props.activePrompt.tags" :key="tag">
              <span class="pbase__prompt-tag-name">{{ tag }}</span>
              <span
                class="material-symbols-outlined pbase__prompt-tag-delete"
                @click="deleteTag(tag)"
                >close_small</span
              >
            </div>
            <input
              type="text"
              v-model="newTag"
              @change="updatePrompt"
              class="pbase__prompt-tag-input"
              placeholder="Add tag..."
            />
          </div>
        </div>
      </div>
      <div class="pbase__icon-close-container">
        <span class="material-symbols-outlined pbase__icon-close" @click="closeActivePrompt()"
          >close</span
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, toRaw, useTemplateRef } from 'vue'
import * as DB from '@/data/db'

const props = defineProps(['activePrompt'])
const emit = defineEmits(['close'])
const selectedPromptType = ref('ZIT')
const selectedPromptText = ref(props.activePrompt.prompts[selectedPromptType.value])
const newTag = ref('')
const promptName = ref(props.activePrompt.name)
const addingNewVariant = ref(false)
const addBtn = useTemplateRef('btn-add')

function addNewPromptVariant(): void {
  addingNewVariant.value = true
  selectedPromptType.value = 'New Prompt Variant'
  selectedPromptText.value = 'Change me..'
  addBtn.value!.disabled = true
}

function imageDataToURL(img: Uint8Array<ArrayBuffer>): string {
  return URL.createObjectURL(new Blob([img], { type: 'image/png' }))
}

function closeActivePrompt(): void {
  emit('close')
}

function isActiveElement(promptType: string): string {
  return promptType == selectedPromptType.value ? 'active' : ''
}

function updateSelectedPromptType(t: string): void {
  if (addingNewVariant.value) {
    addingNewVariant.value = false
  }
  selectedPromptType.value = t
  selectedPromptText.value = props.activePrompt.prompts[selectedPromptType.value]
}

async function updatePrompt(): Promise<void> {
  const updatedPrompts = {
    ...props.activePrompt.prompts,
    [selectedPromptType.value as string]: selectedPromptText.value,
  }

  const updatedPrompt = {
    ...props.activePrompt,
    name: promptName.value,
    prompts: updatedPrompts,
  }

  if (newTag.value != '') {
    updatedPrompt.tags.push(newTag.value)
  }

  updatedPrompt.tags = toRaw(updatedPrompt.tags)
  await DB.putPrompt(toRaw(updatedPrompt))
  props.activePrompt!.prompts = updatedPrompts

  if (addingNewVariant.value) {
    addingNewVariant.value = false
    addBtn.value!.disabled = false
  }
}

async function copyToClipboard(): Promise<void> {
  await navigator.clipboard.writeText(props.activePrompt.prompts[selectedPromptType.value])
}

async function deletePromptVariant(): Promise<void> {
  if (!addingNewVariant.value && selectedPromptType.value != 'ZIT') {
    const updatedPrompt = props.activePrompt
    const promtVariantsKeys = Object.keys(updatedPrompt.prompts)
    const promptVariantToShow =
      promtVariantsKeys[promtVariantsKeys.indexOf(selectedPromptType.value) - 1]
    delete updatedPrompt.prompts[selectedPromptType.value]
    updatedPrompt.tags = toRaw(updatedPrompt.tags)
    await DB.putPrompt(toRaw(updatedPrompt))
    updateSelectedPromptType(promptVariantToShow as string)
    props.activePrompt!.prompts = updatedPrompt.prompts
  }

  if (addingNewVariant.value) {
    addingNewVariant.value = false
    addBtn.value!.disabled = false
    updateSelectedPromptType('ZIT')
  }
}

async function deleteTag(tag: string): Promise<void> {
  const updatedPrompt = props.activePrompt
  if (updatedPrompt.tags.length > 1) {
    updatedPrompt.tags.splice(updatedPrompt.tags.indexOf(tag), 1)
  }
  updatedPrompt.tags = toRaw(updatedPrompt.tags)
  await DB.putPrompt(toRaw(updatedPrompt))
}
</script>
<style scoped>
@import '../assets/css/base.css';

.pbase__active-prompt-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100%;
  background-color: var(--background-color-semitransparent);
  backdrop-filter: var(--blur-effect);
  overflow: hidden;
}

.pbase__prompt-container {
  position: relative;
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
  gap: 15px;
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
  position: absolute;
  top: 15px;
  right: 10px;
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  color: var(--background-color);
  cursor: pointer;
}

.pbase__icon-close {
  width: 100%;
}

.pbase__action-btns-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
  padding: 0 5px;
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

.pbase__btn-delete {
  background-color: var(--warning-color);
}

.pbase__icon {
  font-size: var(--h2-size);
}

.pbase__prompt-field-container {
  width: 100%;
  height: auto;
  padding: 0;
}

.pbase__prompt-field {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  height: 200px;
  min-height: 200px;
  max-height: 250px;
  outline: none;
  font-size: var(--text-medium);
  padding: 5px;
  box-sizing: border-box;
  margin: 0;
  border: none;
  border-top: dashed 1px var(--background-color);
  border-bottom: dashed 1px var(--background-color);
  background-color: var(--secondary-color-darker);
  resize: none;
}

.pbase__prompt-field:focus {
  background-color: var(--text-color);
}

.pbase__active-prompt-heading {
  font-family: var(--font-heading);
  font-size: var(--h1-size);
  font-weight: var(--text-bold);
  padding: 0;
  box-sizing: border-box;
  outline: none;
  border: none;
  background-color: transparent;
}

.pbase__prompt-variants-container {
  width: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  box-sizing: border-box;
}

.pbase__prompt-form-label {
  font-size: var(--h3-size);
  font-weight: var(--text-bold);
  margin-bottom: 4px;
  font-family: var(--font-heading);
}

.pbase__prompt-variant-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0;
  padding: 10px 5px;
  gap: 4px;
  border-top: dashed 1px var(--background-color);
  border-bottom: dashed 1px var(--background-color);
}

.pbase__prompt-variant {
  border: solid 2px var(--background-color);
  padding: 0 5px;
  box-sizing: border-box;
  cursor: pointer;
  font-weight: var(--text-bold);
  font-size: var(--text-small);
  line-height: var(--text-line-heigth-16);
}

.pbase__new-prompt-variant-name-container {
  width: 100%;
  height: auto;
}

.pbase__new-prompt-variant-name {
  width: 100%;
  outline: none;
  font-size: var(--text-small);
  padding: 10px 5px;
  border-radius: 0;
  border: 0;
  margin-bottom: 4px;
  background-color: var(--secondary-color-darker);
  font-family: var(--font-main);
}

.active {
  color: var(--text-color);
  background-color: var(--background-color);
}

.pbase__prompt-tags {
  width: 100%;
  height: max-content;
  font-size: var(--text-small);
  padding: 5px;
  box-sizing: border-box;
  margin: 0;
  border: none;
  border-top: dashed 1px var(--background-color);
  border-bottom: dashed 1px var(--background-color);
  background-color: var(--secondary-color-darker);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
}

.pbase__prompt-tag {
  background-color: var(--background-color);
  color: var(--text-color);
  padding: 3px 2px 3px 5px;
  box-sizing: border-box;
  cursor: pointer;
  font-weight: var(--text-bold);
  line-height: var(--text-line-heigth-16);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  border-radius: var(--icon-rounded);
  gap: 4px;
}

.pbase__prompt-tag-delete {
  background-color: var(--warning-color);
  font-size: var(--h2-size);
  font-weight: var(--text-bold);
  border-radius: var(--icon-rounded);
}

.pbase__prompt-tag-input {
  font-family: var(--font-main);
  font-size: inherit;
  outline: none;
  border: none;
  background-color: transparent;
}

@media only screen and (max-width: 480px) {
  .pbase__prompt-container {
    flex-direction: column;
  }

  .pbase__prompt-image {
    display: none;
  }

  .pbase__active-prompt-context-container {
    width: 100%;
  }
}
</style>
