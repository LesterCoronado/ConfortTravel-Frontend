import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environments.prod';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = `${environment.api}/Paquete`;
  private cachedData: any = null;

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    // Si los datos ya están en la cache, los devuelve directamente
    if (this.cachedData) {
      return of(this.cachedData);
    } else {
      // Si no hay datos en cache, hace la llamada a la API
      return this.http.get<any>(this.apiUrl).pipe(
        tap((data) => {
          this.cachedData = data;
          console.log('data guardada');
        }), // Guarda los datos en cache después de la llamada a la API
        catchError((error) => {
          console.error('Error al obtener los datos de la API', error);
          return of(null); // Maneja el error devolviendo un observable vacío
        })
      );
    }
  }
}
