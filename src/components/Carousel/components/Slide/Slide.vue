<script setup lang="ts">
  import { SlideTypeEnum } from './Slide.enums';
import type { ISlideProps, IClassSettings } from './Slide.interfaces';
import { ref, computed, watchEffect, watch } from 'vue';


  // non viene letta da VUE
  // const { id, url } = defineProps<ISlideProps>();

  const { id, url, current } = defineProps<{
    id: string;
    url: string;
    current: number
  }>();

</script>

<template>
  <article class="slide">
    <img :src="url" :alt="id" class="slide__img">
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