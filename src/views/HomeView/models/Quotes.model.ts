import type { IQuotesResponse } from '../HomeView.interfaces'

export class QuotesModel {
  private _quotes: IQuotesResponse[] = []

  constructor(response: IQuotesResponse[]) {
    this._quotes = response
  }

  public quotesForCarousel = () =>
    this._quotes.map((quote) => ({
      quote: quote.quote,
      category: quote.category,
    }))
}
