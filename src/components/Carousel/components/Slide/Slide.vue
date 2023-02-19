<script setup lang="ts">
  import type { ISlideProps, IClassSettings } from './Slide.interfaces';

  // non viene letta da VUE
  // const { id, url } = defineProps<ISlideProps>();

  const { id, classSettings, url } = defineProps<{
    id: string;
    classSettings: IClassSettings;
    url: string;
  }>();

  const classes = {
    slide: true,
    'slide--current': !!classSettings.current,
    'slide--previous': !!classSettings.previous,
    'slide--next': !!classSettings.next,
  }
</script>

<template>
  <li :class="classes">
    <article class="slide__grid">
      <img :src="url" :alt="id" class="slide__img">
    </article>
  </li>
</template>

<style lang="scss" scoped>
  @import '../../../../assets/styles/breakpoints';

  .slide {
    display: none;
    position: absolute;
    height: 100%;
    width: 100%;

    &__grid {
      height: 100%;
    }

    &__img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    &--current {
      display: block;
      
      @include media($from: lg) {
        max-width: 50%;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    &--previous {
      display: none;
    }

    &--next {
      display: none;
    }
  }
</style>