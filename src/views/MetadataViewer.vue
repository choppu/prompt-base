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
        <p class="pbase__drop-area-content-text">Drag & drop image files here</p>
        <label class="pbase__file-input-label">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/png,image/jpeg,image/webp"
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
        <a
          class="pbase__download-workflow"
          v-if="workflowUrl"
          :href="workflowUrl"
          download="extracted-workflow.json"
          >Download workflow</a
        >
      </div>
      <div class="pbase__file-info-container">
        <div class="pbase__pbase__file-info-selectors-container">
          <div class="pbase__metadata-container">
            <span v-if="generationParams.length == 0">No metadata found</span>
            <div v-for="(params, i) in generationParams" :key="i" class="pbase__file-info">
              <span :class="tabClass(params)" @click="handleSelectedMetadata(i)"
                >Metadata {{ i + 1 }}</span
              >
            </div>
          </div>
          <div class="pbase__file-info-collapsable" v-if="selectedMetadata">
            <div v-if="selectedMetadata.model" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Model</span>
              <span class="pbase__file-info-element-content">{{ selectedMetadata.model }}</span>
            </div>
            <div v-if="selectedMetadata.seed" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Seed</span>
              <span class="pbase__file-info-element-content">{{ selectedMetadata.seed }}</span>
            </div>
            <div v-if="selectedMetadata.clip_skip" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Clip skip</span>
              <span class="pbase__file-info-element-content">{{ selectedMetadata.clip_skip }}</span>
            </div>
            <div v-if="selectedMetadata.sampler" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Sampler</span>
              <span class="pbase__file-info-element-content">{{ selectedMetadata.sampler }}</span>
            </div>
            <div v-if="selectedMetadata.scheduler" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Scheduler</span>
              <span class="pbase__file-info-element-content">{{ selectedMetadata.scheduler }}</span>
            </div>
            <div v-if="selectedMetadata.steps" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Steps</span>
              <span class="pbase__file-info-element-content">{{ selectedMetadata.steps }}</span>
            </div>
            <div v-if="selectedMetadata.cfg" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">CFG</span>
              <span class="pbase__file-info-element-content">{{ selectedMetadata.cfg }}</span>
            </div>
            <div v-if="selectedMetadata.positive_prompt" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Positive Prompt</span>
              <span class="pbase__file-info-element-content">{{
                selectedMetadata.positive_prompt
              }}</span>
            </div>
            <div v-if="selectedMetadata.negative_prompt" class="pbase__file-info-element">
              <span class="pbase__file-info-element-label">Negative Prompt</span>
              <span class="pbase__file-info-element-content">{{
                selectedMetadata.negative_prompt
              }}</span>
            </div>
          </div>
        </div>
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
const selectedMetadata = ref<GenerationParams | null>(null)

const tabClass = (params: GenerationParams): string => {
  return params === selectedMetadata.value
    ? 'pbase__file-info-selector active'
    : 'pbase__file-info-selector'
}

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
  if (imgFile.type !== 'image/png' && imgFile.type !== 'image/jpeg'  && imgFile.type !== 'image/webp') {
    return
  }

  workflowUrl.value = null

  imgFile.arrayBuffer().then((imgData: ArrayBuffer) => {
    selectedFile.value = IMGMetadata.load(new Uint8Array(imgData))
    generationParams.value = selectedFile.value!.getGenerationParams()
    if (generationParams.value.length > 0) {
      selectedMetadata.value = generationParams.value[0]!
    } else {
      selectedMetadata.value = null
    }

    const wf = selectedFile.value.getWorkflow()
    if (wf) {
      workflowUrl.value = URL.createObjectURL(new Blob([wf], { type: 'application/json' }))
    }
  })

  previewUrl.value = URL.createObjectURL(imgFile)
}

const handleSelectedMetadata = (i: number): void => {
  selectedMetadata.value = generationParams.value[i]!
}
</script>

<style scoped>
@import '../assets/css/base.css';

.pbase__uploader-container {
  width: 100%;
  min-height: calc(100vh - 220px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
  box-sizing: border-box;
}

.pbase__drop-area {
  width: 100%;
  height: max-content;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.pbase__drop-area-content {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.pbase__drop-area-content.drag-over {
  background-color: var(--background-color-transparent);
}

.pb__icon {
  font-size: 40px;
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
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  height: fit-content;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  background-color: var(--text-color);
  color: var(--background-color);
  margin: 0 auto;
}

.pbase__preview-container {
  height: auto;
  flex-basis: 380px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: var(--background-color-transparent);
  backdrop-filter: var(--blur-effect);
  overflow-y: hidden;
  box-sizing: border-box;
}

.pbase__preview-image {
  max-width: 330px;
  max-height: 80%;
  box-shadow: var(--menu-box-shadow);
}

.pbase__resolution {
  color: var(--text-color);
  font-size: var(--text-small);
}

.pbase__download-workflow {
  font-size: var(--text-small);
}

.pbase__file-info-container {
  flex-basis: calc(100% - 420px);
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
  box-sizing: border-box;
  padding: 15px 0;
}

.pbase__metadata-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
  box-sizing: border-box;
}

.pbase__pbase__file-info-selectors-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
  box-sizing: border-box;
}

.pbase__file-info {
  box-sizing: border-box;
  margin-bottom: 10px;
}

.pbase__file-info-selector {
  border: solid 2px var(--background-color);
  padding: 3px 5px;
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
  gap: 4px;
  margin-bottom: 10px;
  box-sizing: border-box;
  padding: 0 10px;
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
  width: 100%;
}

.pbase__file-info-collapsable {
  display: flex;
  width: 100%;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 4px;
  height: fit-content;
  overflow-wrap: break-word;
}

.active {
  color: var(--text-color);
  background-color: var(--background-color);
}

@media only screen and (max-width: 600px) {
  .pbase__uploader-container {
    height: 100%;
    min-height: fit-content;
  }

  .pbase__preview-section {
    width: calc(100% - 40px);
    margin: 20px;
    background-color: var(--text-color);
    color: var(--background-color);
    margin: 0 auto;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .pbase__preview-container {
    width: 100%;
    padding: 20px 0;
  }

  .pbase__metadata-container {
    padding: 10px;
  }

  .pbase__file-info-container {
    flex-basis: 100%;
  }
}
</style>
