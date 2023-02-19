<script setup lang="ts">
  const { lengthSlides, currentSlide } = defineProps<{
    lengthSlides: number;
    currentSlide: number;
  }>()

  const getProgressItemClasses = (index: number) => ({
    'progress__item': true,
    'progress__item--selected': index === currentSlide
  })

</script>

<template>
  <div class="progress">
    <div :class="getProgressItemClasses(index)" v-for="(slide, index) in lengthSlides"></div>
  </div>
</template>

<style lang="scss" scoped>
  @import '../../../../assets/styles/variables';
  .progress {
    display: grid;
    grid-template-columns: repeat(v-bind(lengthSlides), 1fr);
    height: 1px;
    width: 100%;
    border-radius: $border-100;
    background-color: $dark;

    &__item {
      &--selected {
        background-color: $celeste-vintage;
      }
    }
  }
</style>