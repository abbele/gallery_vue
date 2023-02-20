<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'

import gsap from 'gsap'

import { CarouselDirectionEnum } from './Carousel.enums'
// import type { ICarouselProps } from './Carousel.interfaces'

import type { ISlide } from './components/Slide/Slide.interfaces'
import SlideVue from './components/Slide/Slide.vue'

import ArrowVue from '../icons/Arrow.vue'

import { getClassesSlide, getClassesProgressItem } from './Carousel.utils'
import { isMobile } from '../../utils'

// TODO: non viene letta da VUE
// const { slides } = defineProps<ICarouselProps>()
const props = defineProps<{
  slides: ISlide[]
  currentSlide: number
}>()

const emit = defineEmits<{
  goPrevious: (direction?: CarouselDirectionEnum) => void
  goNext: (direction?: CarouselDirectionEnum) => void
}>()

const slidesLength = ref(props.slides.length)
const slidesRef = ref<Element[]>([])
const isSliderInProgress = ref(false)

const emitEvents = (direction: CarouselDirectionEnum) => {
  // TODO: refactor
  if (direction === CarouselDirectionEnum.PREVIOUS) {
    //@ts-ignore
    emit('goPrevious', CarouselDirectionEnum.PREVIOUS)
  }

  if (direction === CarouselDirectionEnum.NEXT) {
    //@ts-ignore
    emit('goNext', CarouselDirectionEnum.NEXT)
  }
}

const handleChangeSlide = (direction: CarouselDirectionEnum) => {
  if (isMobile()) {
    emitEvents(direction)
    return
  }

  isSliderInProgress.value = true

  // TODO: centralizzare funzioni
  const dir = direction === CarouselDirectionEnum.NEXT ? 1 : -1
  const nextSlide = slidesRef.value[props.currentSlide - dir]
  const currSlide = slidesRef.value[props.currentSlide]
  const prevSlide = slidesRef.value[props.currentSlide + dir]
  const getPrevOpt = gsap.getProperty(prevSlide)
  const getCurrOpt = gsap.getProperty(currSlide)
  const magicalNumber = 13.5 // Mi aspettavo fosse la differenza di percentuale del css 35

  const tl = gsap.timeline()

  const rightSlide = currSlide.getBoundingClientRect().right
  // TODO: controllare width
  const widthSlide = currSlide.getBoundingClientRect().right
  const heightSlide = currSlide.getBoundingClientRect().height

  const nextOpt =
    direction === CarouselDirectionEnum.NEXT
      ? { x: -getPrevOpt('x') }
      : {
          x: rightSlide + widthSlide / 7.5,
          y: +getCurrOpt('y') - heightSlide / 2,
          rotation: 0,
          opacity: 1,
        }

  const currOpt =
    direction === CarouselDirectionEnum.NEXT
      ? {
          x: -rightSlide + (widthSlide * magicalNumber) / 100,
          y: -getPrevOpt('y') + heightSlide / 2,
          rotation: -getPrevOpt('rotation'),
          opacity: 0.2,
        }
      : {
          x: -(-rightSlide + (widthSlide * magicalNumber) / 100),
          y: -getPrevOpt('y') + heightSlide / 2,
          rotation: -getPrevOpt('rotation'),
          opacity: 0.2,
        }

  const prevOpt =
    direction === CarouselDirectionEnum.NEXT
      ? {
          x: -rightSlide + widthSlide / 7.5,
          y: +getCurrOpt('y') - heightSlide / 2,
          rotation: 0,
          opacity: 1,
        }
      : {
          x: rightSlide + widthSlide / 5,
          y: +getCurrOpt('y') - heightSlide / 2,
          rotation: 0,
          opacity: 1,
        }

  tl.to(nextSlide, nextOpt, 0)
  tl.to(currSlide, currOpt, 0)
  tl.to(prevSlide, prevOpt, 0)

  tl.then(() => {
    gsap.set(currSlide, { clearProps: true })
    gsap.set(nextSlide, { clearProps: true })
    gsap.set(prevSlide, { clearProps: true })

    tl.kill()
    emitEvents(direction)
    isSliderInProgress.value = false
  })
}
</script>

<template>
  <section ref="carousel" class="carousel">
    <ul class="carousel__list">
      <li
        v-for="(slide, index) in props.slides"
        :key="slide.id"
        :class="getClassesSlide(index, currentSlide)"
        :ref="(_ref) => { slidesRef.push(_ref as Element) }"
      >
        <SlideVue :id="slide.id" :url="slide.url" />
      </li>
    </ul>
    <div class="carousel__progress">
      <div class="carousel__progress-wrap">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          :class="getClassesProgressItem(index, currentSlide)"
        ></div>
      </div>
    </div>
    <div
      class="carousel__text"
      v-for="(slide, index) in props.slides"
      :key="slide.id"
      v-show="index === currentSlide"
    >
      <div class="carousel__tag">{{ slide.category }}</div>
      <div class="carousel__description">{{ slide.quote }}</div>
    </div>
    <div class="carousel__actions">
      <button
        class="carousel__button carousel__button--previous"
        @click.prevent="handleChangeSlide(CarouselDirectionEnum.PREVIOUS)"
        :disabled="isSliderInProgress"
      >
        <ArrowVue />
      </button>
      <button
        class="carousel__button carousel__button--next"
        @click.prevent="handleChangeSlide(CarouselDirectionEnum.NEXT)"
        :disabled="isSliderInProgress"
      >
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
  grid-template-rows: $height-slide-small auto auto minmax(0, 1fr);
  gap: $spacer-32;

  @include media($from: lg) {
    grid-template-rows: minmax(0, 4fr) auto minmax(0, 1fr);
    gap: $spacer-40;
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
        opacity: 0.2;
        transform: translateX(50%) rotate(-20deg);
      }
    }

    &--next {
      @include media($from: lg) {
        display: block;
        max-width: 50%;
        top: 50%;
        right: -65%;
        opacity: 0.2;
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

    &:disabled {
      opacity: 0.2;
    }

    svg {
      fill: $celeste-vintage;
    }

    &--previous {
      @include media($from: lg) {
        left: $spacer-64;
      }
    }

    &--next {
      svg {
        transform: rotateZ(180deg);
      }

      @include media($from: lg) {
        right: $spacer-64;
      }
    }
  }
}
</style>
