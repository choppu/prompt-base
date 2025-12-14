<template>
  <ul>
    <li v-for="prompt in prompts" :key="prompt.id">
      {{ prompt.name }}, {{ prompt.naturalPrompt }}
    </li>
  </ul>
</template>

<script lang="ts">
import { liveQuery } from 'dexie'
import { from, useObservable } from '@vueuse/rxjs'
import * as DB from '../data/db'

export default {
  name: 'PromptList',
  setup() {
    const db = DB.getDB()
    return {
      db,
      prompts: useObservable(from(liveQuery(DB.getPrompts))),
    }
  },
}
</script>
