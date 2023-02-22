<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import CarouselVue from '@/components/Carousel/Carousel.vue'

import type { ISlide } from '@/components/Carousel/components/Slide/Slide.interfaces'

import { HomeViewService } from './HomeView.service'

import { SLIDES_LENGTH } from './HomeView.constants'
import router from '@/router'

const route = useRoute()

const isLoaded = ref<boolean>(false)
const slides = ref<ISlide[]>([])
// TODO: add slides lenght value
const currentSlide = ref<number>(+(route.params.id || 0))

watchEffect(async () => {
  Promise.all([
    await HomeViewService.getImgs(`${SLIDES_LENGTH}`),
    await HomeViewService.getQuotes(`${SLIDES_LENGTH}`),
  ]).then(([imgsModel, quotesModel]) => {
    const { quotesForCarousel: quotes } = quotesModel

    slides.value = imgsModel.imgsForCarousel().map((imgs, index) => ({
      id: imgs.id,
      url: imgs.url,
      category: quotes()[index]?.category || 'CATEGORY',
      quote: quotes()[index]?.quote || 'QUOTE',
    }))
    isLoaded.value = true
  })
})

watchEffect(() => {
  currentSlide.value = +(route.params.id || 0)
})

const handleChangeSlide = (followingSlide: number) => {
  currentSlide.value = followingSlide
  router.push(`/${followingSlide}`)
}
</script>

<template>
  <div class="home-view">
    <h1 class="home-view__title">THE GALLERY NAME</h1>
    <CarouselVue v-if="isLoaded" :currentSlide="currentSlide" :slides="slides" @on-change-slide="handleChangeSlide" />
    <div v-else>Loading...</div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../assets/styles/variables';
@import '../../assets/styles/typography';

.home-view {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: $spacer-56;
  place-items: center;
  overflow: hidden;
  height: 100%;

  &__title {
    @include body($is-bold: true, $color: $celeste-vintage);
  }
}
</style>
