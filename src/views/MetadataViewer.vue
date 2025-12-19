<template>
  <div class="pbase__uploader-container">
    <div
      class="pbase__drop-area"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div class="pbase__drop-area-content" :class="{ 'drag-over': isDragOver }">
        <span class="material-symbols-outlined pb__icon">photo_library</span>
        <p class="pbase__drop-area-content-text">Drag & drop PNG/JPEG files here</p>
        <label class="pbase__file-input-label">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/png,image/jpeg"
            class="pbase__file-input"
          />
          <span class="pbase__browse-btn">Browse Files</span>
        </label>
      </div>
    </div>
    <div v-if="selectedFile" class="pbase__preview-section">
      <div class="pbase__preview-container">
        <img :src="previewUrl!" alt="Preview" class="pbase__preview-image" />
        <p class="pbase__resolution">
          Resolution: {{ selectedFile.width }} x {{ selectedFile.height }}
        </p>
      </div>
      <div class="pbase__file-info-container">
        <div class="pbase__pbase__file-info-seed-container">
          {{ generationParams.length }}
          <div v-for="i in generationParams.length" :key="i" class="pbase__file-info">
            <div class="pbase__file-info-selector-element">
              <span class="pbase__file-info-selector">Metadata {{ generationParams.length }}</span>
            </div>
          </div>
          <div
            class="pbase__file-info-collapsable"
            v-for="(params, i) of generationParams"
            :key="i"
          >
            <div v-if="params.model" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Model</span>
              <span class="pbase__file-info-element-content">{{ params.model }}</span>
            </div>
            <div v-if="params.seed" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Seed</span>
              <span class="pbase__file-info-element-content">{{ params.seed }}</span>
            </div>
            <div v-if="params.clip_skip" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Clip skip</span>
              <span class="pbase__file-info-element-content">{{ params.clip_skip }}</span>
            </div>
            <div v-if="params.sampler" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Sampler</span>
              <span class="pbase__file-info-element-content">{{ params.sampler }}</span>
            </div>
            <div v-if="params.scheduler" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Scheduler</span>
              <span class="pbase__file-info-element-content">{{ params.scheduler }}</span>
            </div>
            <div v-if="params.steps" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Steps</span>
              <span class="pbase__file-info-element-content">{{ params.steps }}</span>
            </div>
            <div v-if="params.cfg" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">CFG</span>
              <span class="pbase__file-info-element-content">{{ params.cfg }}</span>
            </div>
            <div v-if="params.positive_prompt" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Positive Prompt</span>
              <span class="pbase__file-info-element-content">{{ params.positive_prompt }}</span>
            </div>
            <div v-if="params.negative_prompt" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Negative Prompt</span>
              <span class="pbase__file-info-element-content">{{ params.negative_prompt }}</span>
            </div>
          </div>
        </div>
        <a v-if="workflowUrl" :href="workflowUrl" download="extracted-workflow.json"
          >Download workflow</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IMGMetadata, { type GenerationParams } from '@/util/img_metadata'
import { ref } from 'vue'

const isDragOver = ref<boolean>(false)
const selectedFile = ref<IMGMetadata | null>(null)
const previewUrl = ref<string | null>(null)
const workflowUrl = ref<string | null>(null)
const generationParams = ref<GenerationParams[]>([])

const handleDragOver = () => {
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  isDragOver.value = false
  if (e.dataTransfer?.files.length) {
    processFiles(e.dataTransfer.files[0]!)
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    processFiles(target.files[0]!)
  }
}

const processFiles = (imgFile: File) => {
  if (imgFile.type !== 'image/png' && (imgFile.type !== 'image/jpeg')) {
    return
  }

  workflowUrl.value = null

  imgFile.arrayBuffer().then((imgData: ArrayBuffer) => {
    selectedFile.value = IMGMetadata.load(new Uint8Array(imgData))
    generationParams.value = selectedFile.value!.getGenerationParams()
    const wf = selectedFile.value.getWorkflow()
    if (wf) {
      workflowUrl.value = URL.createObjectURL(new Blob([wf], { type: 'application/json' }))
    }
  })

  previewUrl.value = URL.createObjectURL(imgFile)
}
</script>

<style scoped>
@import '../assets/css/base.css';

.pbase__uploader-container {
  width: 100%;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.pbase__drop-area {
  width: 100%;
  height: 350px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 40px 20px;
  justify-content: center;
  align-items: center;
}

.pbase__drop-area-content {
  width: 320px;
  height: 280px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  background-color: var(--background-color-semitransparent);
  backdrop-filter: var(--blur-effect);
  border-radius: var(--tag-border-radius);
  box-shadow: var(--menu-box-shadow);
}

.pbase__drop-area-content.drag-over {
  background-color: var(--background-color-transparent);
}

.pb__icon {
  font-size: 70px;
}

.pbase__drop-area-content-text {
  font-size: var(--text-medium);
  text-align: center;
}

.pbase__file-input {
  display: none;
}

.pbase__file-input-label {
  display: inline-block;
  cursor: pointer;
}

.pbase__browse-btn {
  width: max-content;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 3px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background-color: none;
  padding: 5px 8px;
  box-sizing: border-box;
  color: var(--text-color);
  font-family: var(--font-main);
  font-size: var(--text-small);
  font-weight: var(--text-weight-200);
  border-radius: 6px;
  border: solid 2px var(--text-color);
  transition: background 0.3s;
  box-shadow: var(--menu-box-shadow);
}

.pbase__browse-btn:hover {
  background: var(--text-color);
  color: var(--background-color);
}

.pbase__preview-section {
  width: calc(100% - 80px);
  height: 500px;
  margin: 0 40px;
  display: flex;
  background-color: var(--text-color);
  color: var(--background-color);
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 40px;
  overflow-y: scroll;
}

.pbase__preview-container {
  width: 380px;
  flex-grow: 380px;
  flex-basis: 380px;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  background-color: var(--background-color-transparent);
  backdrop-filter: var(--blur-effect);
  gap: 4px;
}

.pbase__preview-image {
  max-width: 330px;
  height: 80%;
  box-shadow: var(--menu-box-shadow);
}

.pbase__resolution {
  color: var(--text-color);
  font-size: var(--text-small);
}

.pbase__file-info-container {
  width: calc(100% - 420px);
  flex-grow: calc(100% - 420px);
  flex-basis: calc(100% - 420px);
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  padding: 15px 0;
  box-sizing: border-box;
}

.pbase__pbase__file-info-seed-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
}

.pbase__file-info {
  box-sizing: border-box;
}

.pbase__file-info-selector {
  border: solid 2px var(--background-color);
  padding: 0 5px;
  box-sizing: border-box;
  cursor: pointer;
  font-weight: var(--text-bold);
  font-size: var(--text-small);
  line-height: var(--text-line-heigth-16);
}

.pbase__file-info-element {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  box-sizing: border-box;
  gap: 4px;
}

.pbase__file-info-element-label {
  width: fit-content;
  font-family: var(--font-heading);
  font-weight: var(--text-bold);
  font-size: var(--text-small);
  text-transform: uppercase;
  border-bottom: dashed 1px var(--background-color);
  line-height: var(--text-line-heigth-20);
}

.pbase__file-info-element-content {
  font-size: var(--text-medium);
}

.pbase__file-info-collapsable {
  display: inherit;
}

.pbase__file-info-collapsed {
  display: inherit;
}

.active {
  color: var(--text-color);
  background-color: var(--background-color);
}
</style>
