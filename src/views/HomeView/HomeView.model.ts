import type { IImgResponse } from "./HomeView.interfaces";

export class HomeViewModel {
  private _imgs: IImgResponse[] = [];

  constructor(response: IImgResponse[]) {
    this._imgs = response
  }

  public imgsForCarousel = () => this._imgs.map((img) => ({
    id: img.id,
    url: img.url
  }))
}