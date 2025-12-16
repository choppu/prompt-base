<template>
  <input type="search" v-model="searchTerm" />
  <div v-for="[tag, promptGroup] of prompts" :key="tag" class="pbase__prompt-group-container">
    <h2 class="pbase__pbase__prompt-group-heading">{{ tag }}</h2>
    <div>
      <div class="pbase__prompts-container">
        <Prompt v-for="(prompt, id) in promptGroup" :key="id" :prompt="prompt" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDexieLiveQuery, useDexieLiveQueryWithDeps } from '@/hooks/useDexieLiveQuery'
import * as DB from '@/data/db'
import Prompt from './PromptComponent.vue'
import { ref } from 'vue'

const searchTerm = ref('')
const tags = useDexieLiveQuery(DB.getTags)
const prompts = useDexieLiveQueryWithDeps(
  [searchTerm],
  ([searchTerm]: [string]) => DB.getPrompts(searchTerm),
  { initialValue: [] },
)
</script>
<style scoped>
@import '../assets/css/base.css';
.pbase__prompt-group-container {
  width: 98%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 0 auto;
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
}
</style>
