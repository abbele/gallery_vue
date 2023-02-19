export interface ISlideProps extends ISlide {
  classSettings: IClassSettings;
}

export interface ISlide {
  id: string;
  url: string;
}

export interface IClassSettings {
  current: boolean;
  previous: boolean;
  next: boolean;
}