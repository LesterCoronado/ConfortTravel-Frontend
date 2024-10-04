import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  // CRUD API
  public get(url: string) {
    return this.http.get(url); //GET
  }
  
  public post(url: string, body: any) {
    return this.http.post(url, body); //Post
  }

  public put(url: string, body: any) {
    return this.http.put(url, body); //Put
  }
  
  public delete(url: string) {
    return this.http.delete(url); // DELETE
  }

    // GET Para descargar archivo .csv 
    public getCSV(url: string, options: any = {}) {
      return this.http.get(url, { ...options, responseType: 'blob' });
    }
}
