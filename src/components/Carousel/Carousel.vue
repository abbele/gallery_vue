<script setup lang="ts">
  import type { ICarouselProps } from './Carousel.interfaces';
  import type { ISlide } from './components/Slide/Slide.interfaces';
  import SlideVue from './components/Slide/Slide.vue';
  import { ref } from 'vue';
  import ProgressVue from './components/Progress/Progress.vue';

  // non viene letta da VUE
  // const { slides } = defineProps<ICarouselProps>()

  const { slides, currentSlide } = defineProps<{
    slides: ISlide[],
    currentSlide: number
  }>()

  // TODO: refactor
  const getClassSettings = (index: number) => ({
    current: index === currentSlide,
    previous: index - 1 === currentSlide,
    next: index + 1 === currentSlide
  })
</script>

<template>
  <section class="carousel">
    <ul class="carousel__list">
      <SlideVue v-for="(slide, index) in slides" :id="slide.id" :url="slide.url" :class-settings="getClassSettings(index)" />
    </ul>
    <div class="carousel__progress">
      <ProgressVue :length-slides="slides.length" :current-slide="currentSlide" />
    </div>
    <div class="carousel__text">
      <div class="carousel__tag">NATURE</div>
      <div class="carousel__description">General caption of this specific image describing the content</div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  @import '../../assets/styles/breakpoints';
  @import '../../assets/styles/typography';
  @import '../../assets/styles/variables';

  .carousel {
    height: 100%;
    width: 100%;
    overflow: auto;
    display: grid;
    grid-template-rows: 1fr auto 1fr;
    gap: 30px;

    @include media($from: lg) {
      grid-template-rows: 4fr auto 1fr;
      gap: 36px;
    }

    &__list {
      position: relative;
      height: 100%;
    }

    &__progress {
      padding: 0 20%;

      @include media($from: lg) {
        padding: 0 35%;
      }
    }

    &__tag {
      @include caption($is-bold: true, $color: $celeste-vintage);
      text-align: center;
      margin-bottom: $spacer-16;
    }

    &__description {
      @include title($is-bold: true, $color: $dark);
      text-align: center;
    }
  }
</style>