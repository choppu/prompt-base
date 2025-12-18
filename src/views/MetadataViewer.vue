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
        <p class="pbase__drop-area-content-text">Drag & drop PNG files here</p>
        <label class="pbase__file-input-label">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept=".png"
            class="pbase__file-input"
          />
          <span class="pbase__browse-btn">Browse Files</span>
        </label>
      </div>
    </div>
    <div v-if="selectedFile" class="pbase__preview-section">
      <div class="pbase__preview-container">
        <img :src="previewUrl!" alt="Preview" class="pbase__preview-image" />
        <p>Resolution: {{ selectedFile.width }} x {{ selectedFile.height }}</p>
      </div>
      <div class="file-info">
        <div v-for="(params, i) of selectedFile.getGenerationParams()" :key="i">
          <p v-if="params.model">Model: {{ params.model }}</p>
          <p v-if="params.clip_skip">Clip skip: {{ params.clip_skip }}</p>
          <p v-if="params.seed">Seed: {{ params.seed }}</p>
          <p v-if="params.sampler">Sampler: {{ params.sampler }}</p>
          <p v-if="params.scheduler">Scheduler: {{ params.scheduler }}</p>
          <p v-if="params.steps">Steps: {{ params.steps }}</p>
          <p v-if="params.cfg">CFG: {{ params.cfg }}</p>
          <p v-if="params.positive_prompt">Positive Prompt: {{ params.positive_prompt }}</p>
          <p v-if="params.negative_prompt">Negative Prompt: {{ params.negative_prompt }}</p>
        </div>
        <a v-if="workflowUrl" :href="workflowUrl" download="extracted-workflow.json"
          >Download workflow</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PNGMetadata from '@/util/png_metadata'
import { ref } from 'vue'

const isDragOver = ref<boolean>(false)
const selectedFile = ref<PNGMetadata | null>(null)
const previewUrl = ref<string | null>(null)
const workflowUrl = ref<string | null>(null)

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

const processFiles = (pngFile: File) => {
  if (pngFile.type !== 'image/png') {
    return
  }

  workflowUrl.value = null

  pngFile.arrayBuffer().then((pngData: ArrayBuffer) => {
    selectedFile.value = PNGMetadata.load(new Uint8Array(pngData))
    const wf = selectedFile.value.getWorkflow()
    if (wf) {
      workflowUrl.value = URL.createObjectURL(new Blob([wf], { type: 'application/json' }))
    }
  })

  previewUrl.value = URL.createObjectURL(pngFile)
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
  overflow: hidden;
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
  background-color: var(--secondary-color-brighter);
}

.pbase__preview-image {
  width: 330px;
}

.file-info {
  width: calc(100% - 420px);
  flex-grow: calc(100% - 420px);
  flex-basis: calc(100% - 420px);
}

.file-info p {
  margin: 5px 0;
}
</style>
