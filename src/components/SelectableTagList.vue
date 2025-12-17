<template>
  <div class="pbase__selectable-tags-list">
    <div
      v-for="tag in props.tags"
      :key="tag"
      :class="classForTag(tag)"
      @click="updateSelectedTags(tag)"
    >
      <span>{{ tag }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps(['tags'])
const selectedTags = ref([] as string[])
const emit = defineEmits(['tagSelect'])

const updateSelectedTags = (tag: string): void => {
  const index = selectedTags.value.indexOf(tag)

  if (index == -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }

  emit('tagSelect', selectedTags.value)
}

const classForTag = (tag: string): string => {
  return selectedTags.value.indexOf(tag) == -1
    ? 'pbase__selectable-tag'
    : 'pbase__selectable-tag pbase__selectable-tag-active'
}
</script>
<style scoped>
@import '../assets/css/base.css';
.pbase__selectable-tags-list {
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.pbase__selectable-tag {
  font-size: var(--text-small);
  font-weight: var(--text-line-heigth-16);
  background-color: var(--background-color);
  color: var(--text-color);
  border: solid 2px var(--text-color);
  padding: 0 8px;
  border-radius: var(--tag-border-radius);
}

.pbase__selectable-tag-active {
  background-color: var(--text-color-darker);
  color: var(--background-color);
}
</style>
