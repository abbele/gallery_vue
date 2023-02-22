<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

import gsap from 'gsap'

import { CarouselDirectionEnum } from './Carousel.enums'
// import type { ICarouselProps } from './Carousel.interfaces'

import type { ISlide } from './components/Slide/Slide.interfaces'
import SlideVue from './components/Slide/Slide.vue'

import ArrowVue from '../icons/Arrow.vue'

import { getClassesSlide, followingSlide } from './Carousel.utils'
import { isMobile } from '../../utils'

// TODO: non viene letta da VUE
// const { slides } = defineProps<ICarouselProps>()
const props = defineProps<{
  slides: ISlide[]
  currentSlide: number
}>()

const emit = defineEmits<{
  onChangeSlide: (index: number) => void
}>()

const slidesLength = ref(props.slides.length)
const slidesRef = ref<Element[]>([])
const isSliderInProgress = ref(false)
const carouselList = ref()

onMounted(() => {
  window.addEventListener('wheel', handleScroll)
  carouselList.value.addEventListener('scroll', handleScrollMobile)

  goTo(props.currentSlide)
})

// TODO: fix first and last slide
const handleScroll = (e: WheelEvent) => {
  if (isSliderInProgress.value) return
  if (isMobile()) return

  const goNext = e.deltaX > 0 || e.deltaY > 0
  const direction = goNext ? CarouselDirectionEnum.NEXT : CarouselDirectionEnum.PREVIOUS

  handleChangeSlide(direction)
}

let timer: ReturnType<typeof setTimeout>
const handleScrollMobile = () => {
  if (!isMobile()) return

  clearTimeout(timer)
  timer = setTimeout(() => {
    slidesRef.value.forEach((slide, index) => {
      if (index > props.slides.length - 1) return

      // TODO: capire perchè 10
      if (Math.abs(slide.getBoundingClientRect().left - carouselList.value.getBoundingClientRect().left) < 1) {
        emitEvents(index)
      }
    })
  }, 100)
}

const emitEvents = (index: number) => {
  //@ts-ignore
  emit('onChangeSlide', index)
}

const goTo = (index: number) => {
  const selectedSlide = slidesRef.value[index]
  const width = selectedSlide.getBoundingClientRect().width

  // TODO: add gsap animation
  carouselList.value.scrollLeft = width * index
}

const handleChangeSlide = (direction: CarouselDirectionEnum) => {
  if (isMobile()) {
    const selectedSlide = slidesRef.value[followingSlide(props.currentSlide, props.slides.length, direction)]
    const width = selectedSlide.getBoundingClientRect().width

    // TODO: add gsap animation
    carouselList.value.scrollLeft = width * followingSlide(props.currentSlide, props.slides.length, direction)
    emitEvents(followingSlide(props.currentSlide, props.slides.length, direction))
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
  const magicalNumber = 20 // Mi aspettavo fosse la differenza di percentuale del css 35

  const tl = gsap.timeline()

  const rightSlide = currSlide.getBoundingClientRect().right
  const widthSlide = currSlide.getBoundingClientRect().width
  const heightSlide = currSlide.getBoundingClientRect().height

  const nextOpt =
    direction === CarouselDirectionEnum.NEXT
      ? { x: -getPrevOpt('x') }
      : {
          x: rightSlide + widthSlide,
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
          css: {
            top: getCurrOpt('top'),
            left: getCurrOpt('left'),
            transform: getCurrOpt('transform'),
          },
          rotation: 0,
          opacity: 1,
        }
      : {
          css: {
            top: getCurrOpt('top'),
            left: getCurrOpt('left'),
            transform: getCurrOpt('transform'),
          },
          rotation: 0,
          opacity: 1,
        }

  tl.to(nextSlide, nextOpt, 0)
  tl.to(currSlide, currOpt, 0)
  tl.to(prevSlide, prevOpt, 0)

  tl.then(() => {
    gsap.set(nextSlide, { clearProps: true })
    gsap.set(currSlide, { clearProps: true })
    gsap.set(prevSlide, { clearProps: true })

    tl.kill()
    window.removeEventListener('wheel', handleScroll)
    emitEvents(followingSlide(props.currentSlide, props.slides.length, direction))
    isSliderInProgress.value = false

    // TODO: fix remove listener
    setTimeout(() => {
      window.addEventListener('wheel', handleScroll)
    }, 700)
  })
}
</script>

<template>
  <section ref="carousel" class="carousel">
    <ul ref="carouselList" class="carousel__list">
      <li
        v-for="(slide, index) in props.slides"
        :key="slide.id"
        :class="getClassesSlide(index, currentSlide, 'carousel__slide')"
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
          :class="getClassesSlide(index, currentSlide, 'carousel__progress-item')"
        ></div>
      </div>
    </div>
    <div class="carousel__info">
      <TransitionGroup name="carousel__text-">
        <div
          v-for="(slide, index) in props.slides"
          :key="slide.id"
          :class="getClassesSlide(index, currentSlide, 'carousel__text')"
          v-show="index === currentSlide"
        >
          <div class="carousel__tag">{{ slide.category }}</div>
          <div class="carousel__description">{{ slide.quote }}</div>
        </div>
      </TransitionGroup>
    </div>
    <div class="carousel__actions">
      <button
        class="carousel__button carousel__button--previous"
        @click.prevent="handleChangeSlide(CarouselDirectionEnum.PREVIOUS)"
        :disabled="isSliderInProgress || props.currentSlide === 0"
      >
        <ArrowVue />
      </button>
      <button
        class="carousel__button carousel__button--next"
        @click.prevent="handleChangeSlide(CarouselDirectionEnum.NEXT)"
        :disabled="isSliderInProgress || props.currentSlide === props.slides.length - 1"
      >
        <ArrowVue />
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '../../assets/styles/animations';
@import '../../assets/styles/breakpoints';
@import '../../assets/styles/typography';
@import '../../assets/styles/variables';

.carousel {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: $height-slide-small auto $height-description-small minmax(0, 1fr);
  gap: $spacer-32;

  @include media($from: lg) {
    grid-template-rows: minmax(0, 4fr) auto minmax(0, 1fr);
    gap: $spacer-40;
  }

  &__list {
    display: flex;
    position: relative;
    height: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;

    @include media($from: lg) {
      overflow: visible;
    }
  }

  &__slide {
    height: 100%;
    width: 100%;
    min-width: 100%;
    scroll-snap-align: start;

    @include media($from: lg) {
      display: none;
      position: absolute;
      min-width: unset;
    }

    // TODO: add hover animation
    &--current {
      @include media($from: lg) {
        display: block;
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
    &--current {
      background-color: $celeste-vintage;
      animation: scale-from-out 1s ease;
    }

    &--previous,
    &--next {
      background-color: $dark;
      transition: background-color 1s ease;
    }
  }

  &__info {
    position: relative;
  }

  &__text {
    position: absolute;
    top: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    // TODO: manage direction
    &--enter-active,
    &--enter-from {
      animation: slide-from-right 0.5s ease;
    }

    &--leave-active,
    &--leave-from {
      animation: slide-to-left 0.5s ease;
    }
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
