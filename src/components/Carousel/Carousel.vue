<script setup lang="ts">
  import type { ICarouselProps } from './Carousel.interfaces';
  import type { ISlide } from './components/Slide/Slide.interfaces';
  import SlideVue from './components/Slide/Slide.vue';
  import { ref, computed, watchEffect, watch, reactive } from 'vue';
  import ArrowVue from '../icons/Arrow.vue';
import { CarouselDirectionEnum } from './Carousel.enums';
import { SlideTypeEnum } from './components/Slide/Slide.enums';

  // non viene letta da VUE
  // const { slides } = defineProps<ICarouselProps>()

  const { slides, currentSlide } = defineProps<{
    slides: ISlide[],
    currentSlide: number
  }>()

  const emit = defineEmits<{
    goPrevious: (direction?: CarouselDirectionEnum) => void,
    goNext: (direction?: CarouselDirectionEnum) => void,
  }>()

  const slidesLength = ref(slides.length)

  // TODO: refactor
  const getClassesSlide = (index: number, current: number) => {
    const isCurrent = index === current
    const isPrevious = index + 1 === current
    const isNext = index - 1 === current

    return {
      'carousel__slide': true,
      'carousel__slide--current': isCurrent,
      'carousel__slide--previous': isPrevious,
      'carousel__slide--next': isNext,
    }
  }

  const getClassesProgressItem = (index: number, current: number) => ({
    'carousel__progress-item': true,
    'carousel__progress-item--selected': index === current
  })
  
</script>

<template>
  <section class="carousel">
    <ul class="carousel__list">
      <li v-for="(slide, index) in slides" :class="getClassesSlide(index, currentSlide)">
        <SlideVue :id="slide.id" :url="slide.url" />
      </li>
    </ul>
    <div class="carousel__progress">
      <div class="carousel__progress-wrap">
        <div v-for="(slide, index) in slides" :class="getClassesProgressItem(index , currentSlide)"></div>
      </div>
    </div>
    <div class="carousel__text" v-for="(slide, index) in slides" v-show="index === currentSlide">
      <div class="carousel__tag">{{ slide.category }}</div>
      <div class="carousel__description">{{ slide.quote }}</div>
    </div>
    <div class="carousel__actions">
      <button 
        class="carousel__button carousel__button--previous" 
        @click.prevent="$emit('goPrevious', CarouselDirectionEnum.PREVIOUS)">
          <ArrowVue />
      </button>
      <button 
        class="carousel__button carousel__button--next" 
        @click.prevent="$emit('goNext', CarouselDirectionEnum.NEXT)">
          <ArrowVue />
      </button>
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
    overflow: hidden;
    display: grid;
    grid-template-rows: 205px auto auto minmax(0, 1fr);
    gap: 30px;

    @include media($from: lg) {
      grid-template-rows: 45px auto minmax(0, 1fr);
      gap: 36px;
    }

    &__list {
      position: relative;
      height: 100%;
    }

    &__slide {
      display: none;
      position: absolute;
      height: 100%;
      width: 100%;

      &--current {
        display: block;
        
        @include media($from: lg) {
          max-width: 50%;
          left: 50%;
          transform: translateX(-50%);
        }
      }

      &--previous {
        @include media($from: lg) {
          display: block;
          max-width: 50%;
          top: 50%;
          left: -65%;
          opacity: .2;
          transform: translateX(50%) rotate(-20deg);
        }
      }

      &--next {
        @include media($from: lg) {
          display: block;
          max-width: 50%;
          top: 50%;
          right: -65%;
          opacity: .2;
          transform: translateX(-50%) rotate(20deg);
        }
      }
    }

    &__progress {
      padding: 0 20%;

      @include media($from: lg) {
        padding: 0 35%;
      }
    }

    &__progress-wrap {
      display: grid;
      grid-template-columns: repeat(v-bind(slidesLength), 1fr);
      height: 1px;
      width: 100%;
      border-radius: $border-100;
      background-color: $dark;
    }

    &__progress-item {
      &--selected {
        background-color: $celeste-vintage;
      }
    }

    &__text {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__tag {
      @include caption($is-bold: true, $color: $celeste-vintage);
      text-align: center;
      margin-bottom: $spacer-16;
      text-transform: uppercase;
    }

    &__description {
      @include title($is-bold: true, $color: $dark);
      text-align: center;

      @include media($from: lg) {
        width: 70%;
      }
    }

    &__actions {
      display: flex;
      justify-content: center;
      gap: $spacer-32;
    }

    &__button {
      position: relative;
      width: $spacer-32;
      height: $spacer-32;
      border-radius: 50%;
      background-color: $dark;

      @include media($from: lg) {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      
      &::after {
        content: '';
        position: absolute;
        left: -3px;
        top: -3px;
        width: calc(100% + 6px);
        height: calc(100% + 6px);
        border-radius: 50%;
        border: 1px solid $dark;
      }

      svg {
        fill: $celeste-vintage;
      }

      &--previous {
        @include media($from: lg) {
          left: 64px;
        }
      }

      &--next {
        svg {
          transform: rotateZ(180deg);
        }

        @include media($from: lg) {
          right: 64px;
        }
      }
    }
  }
</style>