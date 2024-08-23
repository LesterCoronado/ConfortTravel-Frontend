import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private nuevaCotizacionSubject = new Subject<void>();
  private nuevoDestinoSubject = new Subject<void>();
  private nuevaSalidaSubject = new Subject<void>();
  private nuevoPaqueteSubject = new Subject<void>();
  private nuevoIncluyeSubject = new Subject<void>();
  private nuevoNoIncluyeSubject = new Subject<void>();
  private nuevoItinerarioSubject = new Subject<void>();
  private nuevoAdmibnSubject = new Subject<void>();
  private loginSubject = new Subject<void>();


  nuevaCotizacion$ = this.nuevaCotizacionSubject.asObservable();
  nuevoDestino$ = this.nuevoDestinoSubject.asObservable();
  nuevaSalida$ = this.nuevaSalidaSubject.asObservable();
  nuevoPaquete$ = this.nuevoPaqueteSubject.asObservable();
  nuevoIncluye$ = this.nuevoIncluyeSubject.asObservable();
  nuevoNoIncluye$ = this.nuevoNoIncluyeSubject.asObservable();
  nuevoItinerario$ = this.nuevoItinerarioSubject.asObservable();
  nuevoAdmin$ = this.nuevoAdmibnSubject.asObservable();
  nuevoLogin$ = this.loginSubject.asObservable();


  constructor() { }
  notificarNuevaCotizacion() {
    this.nuevaCotizacionSubject.next();
  }
  notificarNuevoDestino() {
    this.nuevoDestinoSubject.next();
  }
  notificarNuevaSalida() {
    this.nuevaSalidaSubject.next();
  }
  notificarNuevoPaquete() {
    this.nuevoPaqueteSubject.next();
  }
  notificarNuevoIncluye() {
    this.nuevoIncluyeSubject.next();
  }
  notificarNuevoNoIncluye() {
    this.nuevoNoIncluyeSubject.next();
  }
  notificarNuevoItinerario() {
    this.nuevoItinerarioSubject.next();
  }
  notificarNuevoAdmin() {
    this.nuevoAdmibnSubject.next();
  }
  notificarNuevoLogin() {
    this.loginSubject.next();
  }
}
