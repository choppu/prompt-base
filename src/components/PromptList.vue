<template>
  <input type="search" v-model="searchTerm" />
  <div v-for="[tag, promptGroup] of prompts" :key="tag" class="pbase__prompt-group-container">
    <h2 class="pbase__pbase__prompt-group-heading">{{ tag }}</h2>
    <div>
      <div class="pbase__prompts-container">
        <PromptView v-for="(prompt, id) in promptGroup" :key="id" :prompt="prompt" />
      </div>
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
.pbase__prompt-group-container {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.pbase__pbase__prompt-group-heading {
  font-family: var(--font-heading);
  padding: 20px;
  box-sizing: border-box;
}

.pbase__prompts-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
</style>
