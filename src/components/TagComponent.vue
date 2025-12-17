<template>
  <div v-for="tag in props.tags" :key="tag" class="pbase__tag">
    <span v-for="(tEl, i) in handleSubTag(tag)" :key="tEl" :class="'pbase__tag-element-' + i">{{
      tEl
    }}</span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps(['tags'])

function handleSubTag(tag: string): string[] {
  return tag.includes(':') ? tag.split(':') : [tag]
}
</script>
<style scoped>
@import '../assets/css/base.css';

.pbase__tag {
  width: max-content;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  border: solid 2px var(--background-color);
  border-radius: var(--tag-border-radius);
  box-sizing: border-box;
  padding: 0;
  overflow: hidden;
  font-size: var(--text-small);
  padding-right: 5px;
}

.pbase__tag-element-0 {
  background: var(--background-color);
  color: var(--text-color);
  display: inline-block;
  padding: 2px 5px;
  box-sizing: border-box;
}
</style>
