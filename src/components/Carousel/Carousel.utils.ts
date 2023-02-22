import { CarouselDirectionEnum } from './Carousel.enums'

export const getClassesSlide = (index: number, current: number, className: string) => {
  const isCurrent = index === current
  const isPrevious = index + 1 === current
  const isNext = index - 1 === current

  return {
    [`${className}`]: true,
    [`${className}--current`]: isCurrent,
    [`${className}--previous`]: isPrevious,
    [`${className}--next`]: isNext,
  }
}

export const followingSlide = (
  currentSlide: number,
  lengthSlide: number,
  direction?: CarouselDirectionEnum,
): number => {
  const isPrevious = direction === CarouselDirectionEnum.PREVIOUS
  const lastSlide = lengthSlide - 1
  const isFirstSlide = currentSlide === 0
  const isLastSlide = currentSlide === lastSlide

  if (isPrevious && isFirstSlide) return currentSlide

  if (isPrevious) {
    return currentSlide - 1
  }

  if (isLastSlide) return currentSlide

  return currentSlide + 1
}
