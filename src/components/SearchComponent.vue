<template>
  <div class="pbase__search-container">
    <div class="pbase__search-input-container">
      <span class="material-symbols-outlined pbase__icon">search</span>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="pbase__search-input"
      />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
}
</script>
<style scoped>
@import '../assets/css/base.css';
.pbase__search-container {
  width: 100%;
  background-color: var(--secondary-color-darker);
  height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  font-size: var(--text-medium);
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
</style>
