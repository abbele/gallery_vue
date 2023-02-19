<script setup lang="ts">
  import { ref, watchEffect, computed, reactive } from 'vue';
  import { useRoute } from 'vue-router';

  import CarouselVue from '@/components/Carousel/Carousel.vue';
  import { CarouselDirectionEnum } from '@/components/Carousel/Carousel.enums';
  
  import type { ISlide } from '@/components/Carousel/components/Slide/Slide.interfaces';

  import { HomeViewService } from './HomeView.service';

  import { SLIDES_LENGTH } from './HomeView.constants';

  const route = useRoute()

  const isLoaded = ref<boolean>(false)
  const slides = ref<ISlide[]>([])
  const currentSlide = ref<number>(2)

  watchEffect(async () => {
    Promise.all([
      await HomeViewService.getImgs(`${SLIDES_LENGTH}`),
      await HomeViewService.getQuotes(`${SLIDES_LENGTH}`)
    ]).then(([imgsModel, quotesModel]) => {
      const { quotesForCarousel: quotes } = quotesModel;

      slides.value = imgsModel.imgsForCarousel().map((imgs, index) => ({
        id: imgs.id,
        url: imgs.url,
        category: quotes()[index].category,
        quote: quotes()[index].quote
      }))
      isLoaded.value = true
    })
  })

  const handleChangeSlide = (direction?: CarouselDirectionEnum) => {
    const isPrevious = direction === CarouselDirectionEnum.PREVIOUS;
    const lastSlide = slides.value.length - 1;
    const isFirstSlide = currentSlide.value === 0;
    const isLastSlide = currentSlide.value === lastSlide;

    if (isPrevious && isFirstSlide) return;

    if (isPrevious) {
      currentSlide.value -= 1;
      return;
    }

    if (isLastSlide) return;
    
    currentSlide.value += 1
  }
</script>

<template>
  <div class="home-view">
    <h1 class="home-view__title">THE GALLERY NAME</h1>
    <CarouselVue 
      v-if="isLoaded" 
      :currentSlide="currentSlide" 
      :slides="slides" 
      @go-previous="handleChangeSlide" 
      @go-next="handleChangeSlide"
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
    gap: $spacer-56;
    place-items: center;
    overflow: hidden;
    height: 100%;

    &__title {
      @include body($is-bold: true, $color: $celeste-vintage)
    }
  }
</style>