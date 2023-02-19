<script setup lang="ts">
  import CarouselVue from '@/components/Carousel/Carousel.vue';
  import { ref, watchEffect } from 'vue'
  import { HomeViewService } from './HomeView.service'

  const img_list = ref<{ id: string, url: string}[]>([])

  watchEffect(async () => {
    const homeViewModel = await HomeViewService.getImgs()

    img_list.value = homeViewModel.imgsForCarousel()
  })
</script>

<template>
  <div class="home-view">
    <h1 class="home-view__title">THE GALLERY NAME</h1>
    <CarouselVue :slides="img_list" />
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
    overflow: auto;
    height: 100%;

    &__title {
      @include body($is-bold: true, $color: $celeste-vintage)
    }
  }
</style>