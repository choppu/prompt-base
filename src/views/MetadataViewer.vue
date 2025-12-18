<template>
  <div class="png-uploader">
    <div 
      class="drop-area"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div class="drop-area-content" :class="{ 'drag-over': isDragOver }">
        <div class="upload-icon">📁</div>
        <p>Drag & drop PNG files here</p>
        <p class="or">or</p>
        <label class="file-input-label">
          <input 
            type="file" 
            ref="fileInput"
            @change="handleFileSelect"
            accept=".png"
            class="file-input"
          >
          <span class="browse-button">Browse Files</span>
        </label>
      </div>
    </div>

    <div v-if="selectedFile" class="preview-section">
      <h3>Selected File Preview</h3>
      <div class="preview-container">
        <img :src="previewUrl!" alt="Preview" class="preview-image">
      </div>
      <div class="file-info">
        <p>Resolution: {{ selectedFile.width }} x {{ selectedFile.height }}</p>
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
        <a v-if="workflowUrl" :href="workflowUrl" download="extracted-workflow.json">Download workflow</a>
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
    return;
  }

  workflowUrl.value = null

  pngFile.arrayBuffer().then((pngData: ArrayBuffer) => {
    selectedFile.value = PNGMetadata.load(new Uint8Array(pngData))
    const wf = selectedFile.value.getWorkflow();
    if (wf) {
      workflowUrl.value = URL.createObjectURL(new Blob([wf], {type: "application/json"}))
    }
  })

  previewUrl.value = URL.createObjectURL(pngFile)
}
</script>

<style scoped>
@import '../assets/css/base.css';

.png-uploader {
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: var(--secondary-color);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.drop-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  transition: all 0.3s ease;
  background-color: var(--secondary-color);
}

.drop-area-content.drag-over {
  background-color: var(--secondary-color-darker);
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.or {
  margin: 10px 0;
  color: white;
}

.file-input {
  display: none;
}

.file-input-label {
  display: inline-block;
  cursor: pointer;
}

.browse-button {
  display: inline-block;
  padding: 10px 20px;
  background: var(--background-color);
  color: white;
  border-radius: 4px;
  transition: background 0.3s;
}

.browse-button:hover {
  background: #45a049;
}

.preview-section {
  margin-top: 30px;
  padding: 20px;
  background-color: var(--background-color);
}

.preview-section h3 {
  margin-top: 0;
  color: white;
}

.preview-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
}

.file-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  font-size: 14px;
}

.file-info p {
  margin: 5px 0;
  color: white;
}
</style>