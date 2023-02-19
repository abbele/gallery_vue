import type { IImgResponse } from "../HomeView.interfaces";

export class ImgListModel {
  private _imgs: IImgResponse[] = [];

  constructor(response: IImgResponse[]) {
    this._imgs = response
  }

  public imgsForCarousel = () => this._imgs.map((img) => ({
    id: img.id,
    url: img.download_url
  })).slice(0, 5)
}