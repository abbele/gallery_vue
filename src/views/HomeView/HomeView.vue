<script setup lang="ts">
  import { CarouselDirectionEnum } from '@/components/Carousel/Carousel.enums';
import CarouselVue from '@/components/Carousel/Carousel.vue';
  import type { ISlide } from '@/components/Carousel/components/Slide/Slide.interfaces';
  import { ref, watchEffect, computed, reactive } from 'vue'
  import { useRoute } from 'vue-router';
  import { SLIDES_LENGTH } from './HomeView.constants';
  import { HomeViewService } from './HomeView.service'

  const route = useRoute()

  const isLoaded = ref<boolean>(false)
  const img_list = ref<ISlide[]>([])
  // const currentSlide = ref<number>((+route.params.id || 0))
  const currentSlide = ref<number>(2)
  const current = reactive(currentSlide)

  // differenza tra watch e watchEffect
  watchEffect(async () => {
    Promise.all([
      await HomeViewService.getImgs(`${SLIDES_LENGTH}`),
      await HomeViewService.getQuotes(`${SLIDES_LENGTH}`)
    ]).then(([imgsModel, quotesModel]) => {
      const { quotesForCarousel: quotes } = quotesModel;

      img_list.value = imgsModel.imgsForCarousel().map((imgs, index) => ({
        id: imgs.id,
        url: imgs.url,
        category: quotes()[index].category,
        quote: quotes()[index].quote
      }))
      isLoaded.value = true
    })
  })

  const handleClickPrevious = (direction?: CarouselDirectionEnum) => {

    if (direction === CarouselDirectionEnum.PREVIOUS) {
      if (current.value === 0) return

      current.value -= 1
      return
    }

    if (current.value === img_list.value.length - 1) return
    current.value += 1
  }
</script>

<template>
  <div class="home-view">
    <h1 class="home-view__title">THE GALLERY NAME</h1>
    <CarouselVue 
      :slides="img_list" 
      :currentSlide="current" 
      v-if="isLoaded" 
      @go-previous="handleClickPrevious" 
      @go-next="handleClickPrevious"
    />
    <div v-else>Loading...</div>
  </div>
</template>

<style lang="scss" scoped>
  @import '../../assets/styles/variables';
  @import '../../assets/styles/typography';

  .home-view {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 56px;
    place-items: center;
    overflow: hidden;
    height: 100%;

    &__title {
      @include body($is-bold: true, $color: $celeste-vintage)
    }
  }
</style>