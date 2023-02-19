import type { ISlide } from './components/Slide/Slide.interfaces'

export interface ICarouselProps {
  slides: ISlide[]
  currentSlide: number
}
