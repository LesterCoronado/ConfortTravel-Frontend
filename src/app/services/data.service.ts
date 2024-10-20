import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environments.prod';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = `${environment.api}/Paquete`;
  private cachedData: any = null;

  constructor(private http: HttpClient) {}

  async getData(): Promise<any> {
    // Si los datos ya están en la cache, los devuelve directamente
    if (this.cachedData) {
      return this.cachedData;
    } else {
      try {
        // Si no hay datos en cache, hace la llamada a la API
        const data = await this.http.get<any>(this.apiUrl).toPromise();
        this.cachedData = data; // Guarda los datos en cache después de la llamada a la API
                return data;
      } catch (error) {
        return null; // Maneja el error devolviendo un valor nulo
      }
    }
  }
}
