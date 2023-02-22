<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { ISlideProps } from './Slide.interfaces'

// non viene letta da VUE
// const { id, url } = defineProps<ISlideProps>();
const props = defineProps<{
  id: string
  url: string
}>()
</script>

<!-- TODO: add li, progress (slot), description inside -->
<template>
  <article class="slide">
    <img :src="props.url" :alt="props.id" class="slide__img" />
  </article>
</template>

<style lang="scss" scoped>
.slide {
  height: 100%;

  &__img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}
</style>
