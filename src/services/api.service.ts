export class ApiService {
  static get = <T>(
    url: string,
    customHeaders?: Record<string, string>,
    params?: Record<string, string>,
  ): Promise<T> => {
    const headers = new Headers()

    if (customHeaders) {
      Object.entries(customHeaders).map(([key, value]) => {
        headers.append(key, value)
      })
    }

    const urlWithQuery = new URL(url)
    if (params) {
      urlWithQuery.search = new URLSearchParams(params).toString()
    }

    return fetch(urlWithQuery.href, { headers, method: 'GET' })
      .then((res: Response) => res.json())
      .catch(console.log)
  }
}
