import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';


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

     //Pagos en línea
  public postPago(url: string, body: any, headers:any= HttpHeaders) {
    return this.http.post(url, body, headers); //Post
  }

  public getPago(url: string, headers:any= HttpHeaders) {
    return this.http.get(url, headers); //GET
  }
  public consultaNit(url: string, headers: any = new HttpHeaders(), params: any = {}) {
    return this.http.get(url, { headers, params });
}

}
