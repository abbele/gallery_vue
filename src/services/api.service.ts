export class ApiService {
  static get = <T>(url: string): Promise<T> => fetch(url, { method: 'GET' })
    .then((res: Response) => res.json()) 
}