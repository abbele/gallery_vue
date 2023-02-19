import type { SlideTypeEnum } from './Slide.enums'

export interface ISlideProps extends ISlide {}

export interface ISlide {
  category: string
  id: string
  quote: string
  url: string
  type?: SlideTypeEnum
}

export interface IClassSettings {
  current: boolean
  previous: boolean
  next: boolean
}
