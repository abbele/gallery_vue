import { API_IMG } from "@/constants/api.constants";
import { ApiService } from "@/services/api.service";
import type { IImgResponse } from "./HomeView.interfaces";
import { HomeViewModel } from "./HomeView.model";

export class HomeViewService {
  static getImgs = (): Promise<HomeViewModel> => 
    ApiService.get<IImgResponse[]>(API_IMG.GET_LIST).then((res) => new HomeViewModel(res))
}