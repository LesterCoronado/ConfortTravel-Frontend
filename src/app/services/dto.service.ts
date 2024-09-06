import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DTOService {
  private userSubject = new BehaviorSubject<any>(null);
  private idCotizacion = new BehaviorSubject<any>(null);
  private idDestino = new BehaviorSubject<any>(null);
  private idSalida = new BehaviorSubject<any>(null);
  private idVehiculo = new BehaviorSubject<any>(null);
  private idHotel = new BehaviorSubject<any>(null);
  private idReserva = new BehaviorSubject<any>(null);
  private idPaquete = new BehaviorSubject<any>(null);
  private idIncluye = new BehaviorSubject<any>(null);
  private idNoIncluye = new BehaviorSubject<any>(null);
  private idItinerario = new BehaviorSubject<any>(null);
  private adminSubject = new BehaviorSubject<any>(null);

  constructor() {}

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

  //Para Editar y Agregar Salidas
  setIdSalida(id: any) {
    this.idSalida.next(id);
  }
  getIdSalida() {
    return this.idSalida.asObservable();
  }
   //Para Editar y Agregar Veviculos
   setIdVehiculo(id: any) {
    this.idVehiculo.next(id);
  }
  getIdVehiculo() {
    return this.idVehiculo.asObservable();
  }

  //Para Editar y Agregar Hoteles
  setIdHotel(id: any) {
    this.idHotel.next(id);
  }
  getIdHotel() {
    return this.idHotel.asObservable();
  }

  //Para Editar y Agregar Reservas
  setIdReserva(id: any) {
    this.idReserva.next(id);
  }
  getIdReserva() {
    return this.idReserva.asObservable();
  }


    //Para Editar y Agregar Paquetes
    setIdPaquete(id: any) {
      this.idPaquete.next(id);
    }
    getIdPaquete() {
      return this.idPaquete.asObservable();
    }
     //Para Editar y Agregar lista de cosas que Incluye un paquete
     setIdIncluye(id: any) {
      this.idIncluye.next(id);
    }
    getIdIncluye() {
      return this.idIncluye.asObservable();
    }
     //Para Editar y Agregar lista de cosas que NO Incluye un paquete
     setIdNoIncluye(id: any) {
      this.idNoIncluye.next(id);
    }
    getIdNoIncluye() {
      return this.idNoIncluye.asObservable();
    }
    //Para Agregar Itinerarios
    setIdItinerario(id: any) {
      this.idItinerario.next(id);
    }
    getIdItineario() {
      return this.idItinerario.asObservable();
    }
   

  setAdmin(user: any) {
    this.userSubject.next(user);
  }
  getAdmin() {
    return this.userSubject.asObservable();
  }
}
