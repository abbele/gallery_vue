export const getClassesSlide = (index: number, current: number) => {
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

export const getClassesProgressItem = (index: number, current: number) => ({
  'carousel__progress-item': true,
  'carousel__progress-item--selected': index === current
})