import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DTOService {
  private userSubject = new BehaviorSubject<any>(null);
  private idCotizacion = new BehaviorSubject<any>(null);
  private idDestino = new BehaviorSubject<any>(null);
  private adminSubject = new BehaviorSubject<any>(null);



  constructor() { }

  //Inicio de sesión con usuarios registrados
  setUser(user: any) {
    this.userSubject.next(user);
  }
  getUser() {
    return this.userSubject.asObservable();
  }
  deleteUser() {
    this.userSubject.next(null);
  }

   //Para Editar y Agregar Cotizaciones
   setIdCotizacion(id: any) {
    this.idCotizacion.next(id);
  }
  getIdCotizacion() {
    return this.idCotizacion.asObservable();
  }

     //Para Editar y Agregar Destinos
     setIdDestino(id: any) {
      this.idDestino.next(id);
    }
    getIdDestino() {
      return this.idDestino.asObservable();
    }

  setAdmin(user: any) {
    this.userSubject.next(user);
  }
  getAdmin() {
    return this.userSubject.asObservable();
  }

}
