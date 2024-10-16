import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { environment } from '../../environments/environments.prod';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { StepperModule } from 'primeng/stepper';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-pagos-pendientes',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    MessagesModule,
    StepperModule,
    InputNumberModule,
    FormsModule,
  ],
  templateUrl: './pagos-pendientes.component.html',
  styleUrl: './pagos-pendientes.component.css',
  styles: [
    `
      .p-stepper {
        flex-basis: 50rem;
      }
    `,
  ],
})
export class PagosPendientesComponent {
  nitValido: boolean = false; //para validar si el nit introducido por el usuario es valido
  nitNotFound: boolean = false; //para validar si el nit introducido por el usuario es valido
  nit: number | any; //almacena el nit del usuario
  nombre = signal<string>(''); //almacena el nombre del contribuyente
  messajesNit?: Message[] | any; //mensaje que se muestra al usuario con el nombre del contribuyente
  messajesNitNotFound?: Message[] | any; //mensaje que se muestra al usuario si no se encuentra el nit
  messages: Message[] | any; //mensaje que se muestra al usuario("Realiza pagos con tarjeta de crédito y débito")
  pagosPendientes: any = []; //almacena los pagos pendientes del usuario
  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
    private router: Router
  ) {
    //obtiene el id del usuario y llama a la función getPagosPendientes
    this.route.params.subscribe((params) => {
      this.getPagosPendientes(params['id']);
      let email = sessionStorage.getItem('email');
      this.comprobarNit(email);
    });
  }
  ngOnInit() {

    this.messages = [
      {
        severity: 'info',
        detail: 'Realiza pagos con tarjeta de crédito y débito',
      },
    ];
    
  }

  getPagosPendientes(id: any) {
    this.backend.get(`${environment.api}/OrdenPago/${id}`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.pagosPendientes = data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  //consulta a la base de datos por el Nit del usuario, el valor lo almacena en la variable nit
  comprobarNit(email: any) {
    this.backend.get(`${environment.api}/NitUsuario?email=${email}`).subscribe({
      next: (data: any) => {
        this.nit = data.nit;
        if (data.nit != null) {
          this.consultarNit();

        }
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  //consulta a la API de Digifact por el Nit, valida el nit y muestra la información del usuario
  consultarNit() {
    this.backend.get(`${environment.api}/FEL?nit=${this.nit}`).subscribe({
      next: (data: any) => {
        console.log(data);
        let response = data.RESPONSE;
        console.log(response[0].NOMBRE);
        let _nombre = response[0].NOMBRE;
        this.nitValido = _nombre !== '';
        this.nitNotFound = _nombre == '';

        // Dividir el string en partes usando la coma como separador
        let partes = _nombre.split(',');
        // Filtrar los valores vacíos
        let nombresFiltrados = partes.filter(
          (parte: any) => parte.trim() !== ''
        );
        // Formatear la salida
        let nombreFormateado = `${nombresFiltrados[0]} ${nombresFiltrados[1]}, ${nombresFiltrados[2]} ${nombresFiltrados[3]}`;

        // Asignar el nombre formateado a la variable nombre
        this.nombre.set(nombreFormateado);

        //setea el nomnbre del contribuyente en la variable messajesNit

        //setea el mensaje si el nit es valido
        this.messajesNit = [
          {
            severity: 'success',
            detail: this.nombre(),
          },
        ];
        //setea el mensaje si el nit no es valido
        this.messajesNitNotFound = [
          {
            severity: 'error',
            detail: 'El nit es invalido',
          },
        ];

        //almacenar el nit y el nombre del contribuyente para generar el FEL
        sessionStorage.setItem('nit', this.nit);
        sessionStorage.setItem('nombre', this.nombre());
        
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  setCurrentData(idCotizacion: any, idOrdenDePago: any) {
    sessionStorage.setItem('idCotizacion', idCotizacion)
    sessionStorage.setItem('idOrdenDePago', idOrdenDePago)
  }

  
}
