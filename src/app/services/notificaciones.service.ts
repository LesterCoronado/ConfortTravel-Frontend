import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private nuevaCotizacionSubject = new Subject<void>();
  private nuevoDestinoSubject = new Subject<void>();
  private nuevoAdmibnSubject = new Subject<void>();
  private loginSubject = new Subject<void>();


  nuevaCotizacion$ = this.nuevaCotizacionSubject.asObservable();
  nuevoDestino$ = this.nuevoDestinoSubject.asObservable();
  nuevoAdmin$ = this.nuevoAdmibnSubject.asObservable();
  nuevoLogin$ = this.loginSubject.asObservable();


  constructor() { }
  notificarNuevaCotizacion() {
    this.nuevaCotizacionSubject.next();
  }
  notificarNuevoDestino() {
    this.nuevoDestinoSubject.next();
  }
  notificarNuevoAdmin() {
    this.nuevoAdmibnSubject.next();
  }
  notificarNuevoLogin() {
    this.loginSubject.next();
  }
}
