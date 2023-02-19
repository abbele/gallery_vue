import { API_IMG, API_QUOTE } from "@/constants/api.constants";
import { ApiService } from "@/services/api.service";
import type { IImgResponse, IQuotesResponse } from "./HomeView.interfaces";
import { ImgListModel } from "./models/ImgList.model";
import { QuotesModel } from "./models/Quotes.model";

// TODO: refactor par7ams to get
export class HomeViewService {
  static getImgs = (limit: string): Promise<ImgListModel> => 
    ApiService.get<IImgResponse[]>(API_IMG.GET_LIST, undefined, { limit }).then((res) => new ImgListModel(res))

  static getQuotes = (limit: string): Promise<QuotesModel> => {
    const headers = {
      'X-Api-Key': import.meta.env.VITE_API_NINJA_KEY || ''
    }

    return ApiService.get<IQuotesResponse[]>(API_QUOTE.GET_LIST, headers, { limit }).then((res) => new QuotesModel(res))
  }
}