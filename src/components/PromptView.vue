<template>
  <div class="pbase__prompt-container">
    <div class="pbase__relative-container">
      <div class="pbase__prompt-context-container">
        <p>{{ props.prompt.naturalPrompt }}</p>
      </div>
      <img :src="imageDataToURL(prompt.image)" class="pbase__prompt-image" />
    </div>
    <div class="pbase__prompt-bottom">
      <h3 class="pbase__prompt-heading">{{ props.prompt.name }}</h3>
      <ul class="pbase__tags-list">
        <li v-for="tag in props.prompt.tags" :key="tag" class="pbase__tag">
          <span
            v-for="(tEl, i) in handleSubTag(tag)"
            :key="tEl"
            :class="'pbase__tag-element-' + i"
            >{{ tEl }}</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps(['prompt'])

function imageDataToURL(img: Uint8Array<ArrayBuffer>): string {
  return URL.createObjectURL(new Blob([img], { type: 'image/png' }))
}

function handleSubTag(tag: string): string[] {
  return tag.includes(':') ? tag.split(':') : [tag]
}
</script>
<style scoped>
@import '../assets/css/base.css';
.pbase__prompt-container {
  display: flex;
  flex-direction: column;
  width: 350px;
  flex-grow: 350px;
  flex-basis: 350px;
  background: var(--background-white);
  padding: 15px 20px 0 20px;
  box-sizing: border-box;
}

.pbase__prompt-bottom {
  width: 100%;
  padding: 20px 10px;
  box-sizing: border-box;
  height: 100px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.pbase__prompt-heading {
  width: 100%;
  color: var(--secondary-color);
  font-weight: var(--text-bold);
  font-family: var(--font-heading);
  font-size: var(--h3-size);
  box-sizing: border-box;
}

.pbase__tags-list {
  width: 100%;
  color: var(--background-color);
  font-size: var(--text-small);
  font-weight: var(--text-semibold);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
  box-sizing: border-box;
}

.pbase__tag {
  border: solid 2px var(--background-color);
  border-radius: var(--tag-border-radius);
  box-sizing: border-box;
  padding: 0;
  overflow: hidden;
}

.pbase__tag-element-0 {
  background: var(--background-color);
  color: var(--text-color);
  display: inline-block;
  padding: 2px 5px;
  box-sizing: border-box;
}

.pbase__relative-container {
  position: relative;
}

.pbase__prompt-context-container {
  position: absolute;
  opacity: 0;
}

.pbase__prompt-image {
  width: 100%;
  box-shadow: var(--shadow-color) 0px 7px 29px 0px;
}
</style>
