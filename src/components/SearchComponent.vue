<template>
  <div class="pbase__search-container">
    <div class="pbase__search-input-container">
      <span class="material-symbols-outlined pbase__icon">search</span>
      <input
        placeholder="Search..."
        :value="props.modelValue.searchString"
        @input="
          emit('update:modelValue', updateSearchString(($event.target as HTMLInputElement).value))
        "
        class="pbase__search-input"
      />
    </div>
    <SelectableTagList :tags="props.tags" @tagSelect="handleTagSelect" />
  </div>
</template>
<script setup lang="ts">
import type { SearchParams } from '@/types/Search'
import SelectableTagList from './SelectableTagList.vue'
const props = defineProps(['modelValue', 'tags'])
const emit = defineEmits(['update:modelValue'])

const updateSearchString = (searchString: string): SearchParams => {
  return { searchString: searchString, filterTags: props.modelValue?.filterTags }
}

const handleTagSelect = (tagsSelected: string[]): void => {
  emit('update:modelValue', {
    searchString: props.modelValue?.searchString,
    filterTags: tagsSelected,
  })
}
</script>
<style scoped>
@import '../assets/css/base.css';
.pbase__search-container {
  width: 100%;
  background-color: var(--secondary-color-darker);
  padding: 40px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.pbase__search-input-container {
  width: 40%;
  padding: 8px 10px;
  background-color: var(--text-color);
  box-sizing: border-box;
  border-radius: var(--container-border-radius);
  box-shadow: var(--menu-box-shadow);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.pbase__icon {
  font-size: var(--text-default-size);
  line-height: 30px;
  background-color: var(--secondary-color);
  color: var(--text-color);
  width: var(--icon-default-width);
  height: var(--icon-default-height);
  text-align: center;
  border-radius: var(--icon-rounded);
}

.pbase__search-input {
  width: calc(100% - 40px);
  height: 100%;
  font-size: var(--text-default-size);
  font-family: var(--font-main);
  border: none;
  background-color: transparent;
  outline: none;
}

@media only screen and (max-width: 600px) {
  .pbase__search-container {
    padding: 20px 0;
  }

  .pbase__search-input-container {
    width: 90%;
  }
}
</style>
