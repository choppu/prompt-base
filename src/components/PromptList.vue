<template>
  <input type="search" v-model="searchTerm" />
  <div v-for="[tag, promptGroup] of prompts" :key="tag">
    <h2>{{ tag }}</h2>
    <div class="pbase__group-container">
      <PromptView v-for="(prompt, id) in promptGroup" :key="id" :prompt="prompt" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDexieLiveQueryWithDeps } from '@/hooks/useDexieLiveQuery'
import * as DB from '@/data/db'
import PromptView from './PromptView.vue'
import { ref } from 'vue'

const searchTerm = ref('')
const prompts = useDexieLiveQueryWithDeps(
  [searchTerm],
  ([searchTerm]: [string]) => DB.getPrompts(searchTerm),
  { initialValue: [] },
)
</script>
<style scoped>
@import '../assets/css/base.css';

.pbase__group-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
