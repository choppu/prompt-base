<script setup lang="ts"></script>
<template>
  <div class="pbase__about-container">
    <p class="pbase__about-text">
      Created by: <a href="https://github.com/choppu" class="pbase__about-link">@choppu</a> and
      <a href="https://github.com/choppu" class="pbase__about-link">@bitgamma</a>.
    </p>
    <p class="pbase__about-text">
      The original prompts are from
      <a href="https://github.com/BesianSherifaj-AI/PromptCraft" class="pbase__about-link"
        >PromptCraft</a
      >
      by
      <a href="https://github.com/BesianSherifaj-AI" class="pbase__about-link">BesianSherifaj-AI</a
      >. This project wouldn't have been possible without his work.
    </p>
  </div>
</template>
<style scoped>
@import '../assets/css/base.css';

.pbase__about-container {
  width: 100%;
  padding: 20px 40px;
  box-sizing: border-box;
}

.pbase__about-text {
  font-size: var(--text-medium);
}

@media only screen and (max-width: 600px) {
  .pbase__about-container {
    padding: 20px;
  }
}
</style>
