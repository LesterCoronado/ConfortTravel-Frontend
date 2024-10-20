import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private nuevaCotizacionSubject = new Subject<void>();
  private nuevoBonoSubject = new Subject<void>();
  private nuevoDescuentoSubject = new Subject<void>();
  private nuevoDestinoSubject = new Subject<void>();
  private nuevaSalidaSubject = new Subject<void>();
  private nuevoVehiculoSubject = new Subject<void>();
  private nuevoHotelSubject = new Subject<void>();
  private nuevaReservaSubject = new Subject<void>();
  private nuevoEmpleadoSubject = new Subject<void>();
  private nuevaPlanillaSubject = new Subject<void>();
  private nuevoGenerarPagoSubject = new Subject<void>();
  private nuevoPaqueteSubject = new Subject<void>();
  private nuevoIncluyeSubject = new Subject<void>();
  private nuevoNoIncluyeSubject = new Subject<void>();
  private nuevoItinerarioSubject = new Subject<void>();
  private nuevoAdmibnSubject = new Subject<void>();
  private nuevoClienteSubject = new Subject<void>();
  private loginSubject = new Subject<void>();


  nuevaCotizacion$ = this.nuevaCotizacionSubject.asObservable();
  nuevoBono$ = this.nuevoBonoSubject.asObservable();
  nuevoDescuento$ = this.nuevoDescuentoSubject.asObservable();
  nuevoDestino$ = this.nuevoDestinoSubject.asObservable();
  nuevaSalida$ = this.nuevaSalidaSubject.asObservable();
  nuevoVehiculo$ = this.nuevoVehiculoSubject.asObservable();
  nuevoHotel$ = this.nuevoHotelSubject.asObservable();
  nuevaReserva$ = this.nuevaReservaSubject.asObservable();
  nuevoEmpleado$ = this.nuevoEmpleadoSubject.asObservable();
  nuevaPlanilla$ = this.nuevaPlanillaSubject.asObservable();
  nuevoGenerarPago$ = this.nuevoGenerarPagoSubject.asObservable();
  nuevoPaquete$ = this.nuevoPaqueteSubject.asObservable();
  nuevoIncluye$ = this.nuevoIncluyeSubject.asObservable();
  nuevoNoIncluye$ = this.nuevoNoIncluyeSubject.asObservable();
  nuevoItinerario$ = this.nuevoItinerarioSubject.asObservable();
  nuevoAdmin$ = this.nuevoAdmibnSubject.asObservable();
  nuevoCliente$ = this.nuevoClienteSubject.asObservable();
  nuevoLogin$ = this.loginSubject.asObservable();


  constructor() { }
  notificarNuevaCotizacion() {
    this.nuevaCotizacionSubject.next();
  }
  notificarNuevoBono() {
    this.nuevoBonoSubject.next();
  }
  notificarNuevoDescuento() {
    this.nuevoDescuentoSubject.next();
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
  notificarNuevoVehiculo() {
    this.nuevoVehiculoSubject.next();
  }
  notificarNuevoHotel() {
    this.nuevoHotelSubject.next();
  }
  notificarNuevaReserva() {
    this.nuevaReservaSubject.next();
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
  notificarNuevoEmpleado() {
    this.nuevoEmpleadoSubject.next();
  }
  notificarNuevaPlanilla() {
    this.nuevaPlanillaSubject.next();
  }
  notificarGenerarPago() {
    this.nuevoGenerarPagoSubject.next();
  }
  
  notificarNuevoAdmin() {
    this.nuevoAdmibnSubject.next();
  }
  notificarNuevoCliente() {
    this.nuevoClienteSubject.next();
  }
  notificarNuevoLogin() {
    this.loginSubject.next();
  }
}
