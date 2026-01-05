<script setup lang="ts">
import { ref } from 'vue'

const isDragOver = ref<boolean>(false)

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

const processFiles = (imgFile: File) => {}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    processFiles(target.files[0]!)
  }
}
</script>
<template>
  <div class="pbase__form-container">
    <div
      class="pbase__drop-area"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div class="pbase__drop-area-content" :class="{ 'drag-over': isDragOver }">
        <span class="material-symbols-outlined pb__icon">photo_library</span>
        <p class="pbase__drop-area-content-text">Drag & drop PNG/JPEG file here</p>
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
    <div class="pbase__form-fields-container">
      <div class="pbase__form-field-container">
        <input type="text" name="prompt-name" placeholder="New Prompt" />
      </div>
    </div>
  </div>
</template>
<style scoped>
@import '../assets/css/base.css';

.pbase__form-container {
  width: 80%;
  height: 550px;
  margin: 20px auto;
  background-color: var(--text-color);
  color: var(--background-color);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  padding: 15px;
  box-sizing: border-box;
}

.pbase__drop-area {
  flex-basis: 272px;
  height: 480px;
  background-color: var(--background-color-semitransparent);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
}

.pbase__drop-area-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.pbase__file-input-label {
  display: block;
  width: fit-content;
  text-align: center;
  margin: 0 auto;
}

.pbase__file-input {
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
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
  font-family: var(--font-main);
  font-size: var(--text-small);
  font-weight: var(--text-weight-200);
  border-radius: 6px;
  border: solid 2px var(--background-color);
  transition: background 0.3s;
}

.pbase__drop-area-content-text {
  text-align: center;
  font-size: var(--text-small);
}
</style>
