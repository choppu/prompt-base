<template>
  <Search v-model="searchTerm" :tags="tags" />
  <div v-for="[tag, promptGroup] of prompts" :key="tag" class="pbase__prompt-group-container">
    <h2 class="pbase__pbase__prompt-group-heading">{{ tag }}</h2>
    <div>
      <div class="pbase__prompts-container">
        <PromptComponent
          @prompt-selected="(val) => (activePrompt = val)"
          v-for="(prompt, id) in promptGroup"
          :key="id"
          :prompt="prompt"
        />
      </div>
    </div>
  </div>
  <ActivePrompt v-if="activePrompt" :active-prompt="activePrompt" @close="activePrompt = null" />
</template>

<script setup lang="ts">
import { useDexieLiveQuery, useDexieLiveQueryWithDeps } from '@/hooks/useDexieLiveQuery'
import * as DB from '@/data/db'
import PromptComponent from './PromptComponent.vue'
import ActivePrompt from './ActivePromptComponent.vue'
import Search from './SearchComponent.vue'
import { ref, toRaw } from 'vue'
import type { SearchParams } from '@/types/Search'
import type { Prompt } from '@/types/Prompt'

const searchTerm = ref({
  searchString: '',
  filterTags: [],
})

const tags = useDexieLiveQuery(DB.getTags)
const prompts = useDexieLiveQueryWithDeps(
  [searchTerm],
  ([searchTerm]: [SearchParams]) =>
    DB.getPrompts(searchTerm.searchString, toRaw(searchTerm.filterTags)),
  { initialValue: [] },
)
const activePrompt = ref<Prompt | null>(null)
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
  margin: 0 auto;
  padding: 20px 0;
  box-sizing: border-box;
}

.pbase__pbase__prompt-group-heading {
  font-family: var(--font-heading);
  padding: 20px;
  box-sizing: border-box;
  font-size: var(--logo-text-size);
  font-weight: var(--text-bold);
}

.pbase__prompts-container {
  width: 100vw;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 20px;
}

@media only screen and (max-width: 480px) {
  .pbase__prompts-container {
    justify-content: center;
    flex-direction: column;
  }
}

@media only screen and (max-width: 600px) {
  .pbase__prompts-container {
    width: 100%;
    padding: 20px;
  }

  .pbase__pbase__prompt-group-heading {
    font-size: var(--h2-size);
    padding: 0 20px;
  }
}

@media only screen and (min-width: 501px) and (max-width: 900px) {
  .pbase__prompts-container {
    width: 100vw;
    gap: 4px;
    padding: 0 20px;
  }
}
</style>
