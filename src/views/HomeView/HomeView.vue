<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import { HomeViewService } from './HomeView.service'

  const img_list = ref<{ id: string, url: string}[]>([])

  watchEffect(async () => {
    const homeViewModel = await HomeViewService.getImgs()

    img_list.value = homeViewModel.imgsForCarousel()
  })
</script>

<template>
  <div v-for="img in img_list">
    {{ img.id }}
  </div>
</template>

<style lang="scss" scoped>

</style>