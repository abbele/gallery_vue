<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
  @import './assets/styles/variables';
  @import './assets/styles/typography';

  main {
    height: 100vh;
    background-color: $background;
    overflow: auto;
    padding: $spacer-32 $spacer-16 $spacer-16;

    @include media($from: lg) {
      padding: $spacer-48 0 $spacer-56;
    }
  }
</style>
