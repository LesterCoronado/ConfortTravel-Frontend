import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { Router } from '@angular/router';
import { DatePipe, NgFor } from '@angular/common';
import { DTOService } from '../../../services/dto.service';
import { environment } from '../../../environments/environments.prod';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificacionesService } from '../../../services/notificaciones.service';

@Component({
  selector: 'app-editar-cotizaciones',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor],
  templateUrl: './editar-cotizaciones.component.html',
  styleUrl: './editar-cotizaciones.component.css',
})
export class EditarCotizacionesComponent {
  idCotizacion: any;
  Usuarios: any = [];
  Paquetes: any = [];
  Salidas: any = [];
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private notificaciones: NotificacionesService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<EditarCotizacionesComponent>
  ) {
    this.crearFormulario = this.fb.group({
      idCotizacion: ['', Validators.required],
      idUsuario: ['', Validators.required],
      idPaqueteViaje: ['', Validators.required],
      fechaSalida: ['', Validators.required],
      totalAdultos: ['', Validators.required],
      totalNinos: ['', Validators.required],
      comentario: ['', Validators.required],
      precioCotizacion: ['', Validators.required],
      validoHasta: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.esEditar();
    this.getPaquetes();
    this.getUsuarios();
  }
  esEditar() {
    let data: any;
    data = this.DTO.getIdCotizacion();
    let id = data.source._value;

    this.backend.get(`${environment.api}/Cotizacion/${id}`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.idCotizacion = data[0].idCotizacion;
        this.getSalidas(data.idDestino);
        const datePipe = new DatePipe('en-US');
        const formattedFechaSalida = datePipe.transform(
          data[0].fechaSalida,
          'yyyy-MM-dd'
        );

        const formattedValidoHasta = datePipe.transform(
          data[0].validoHasta,
          'yyyy-MM-dd'
        );
        this.crearFormulario.setValue({
          idCotizacion: data[0].idCotizacion,
          idUsuario: data[0].idUsuario,
          idPaqueteViaje: data[0].idPaqueteViaje,
          fechaSalida: formattedFechaSalida,
          totalAdultos: data[0].totalAdultos,
          totalNinos: data[0].totalNinos,
          comentario: data[0].comentario,
          precioCotizacion: data[0].precioCotizacion,
          validoHasta: formattedValidoHasta,
        });
      },

      error: (err: any) => {},
    });
  }
  listarProductos() {
    this.backend.get(`${environment.api}/Usuarios`).subscribe({
      next: (data: any) => {
        this.Usuarios = data;
      },
    });
  }

  getPaquetes() {
    this.backend.get(`${environment.api}/Paquete`).subscribe({
      next: (data: any) => {
        this.Paquetes = data;
      },
      error: (err) => {},
    });
  }
  getUsuarios() {
    this.backend.get(`${environment.api}/Usuarios`).subscribe({
      next: (data: any) => {
        this.Usuarios = data;
      },
      error: (err) => {},
    });
  }
  getSalidas(id: any) {
    this.backend.get(`${environment.api}/SalidaDestino/${id}`).subscribe({
      next: (data: any) => {
        this.Salidas = data;
        data.forEach((element: any) => {});
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  formulario() {
    console.log(this.crearFormulario.value);
    let data: any;

    // Convertir idDestino e idSalida a enteros
    const formValue = this.crearFormulario.value;
    formValue.idPaqueteViaje = parseInt(formValue.idPaqueteViaje, 10);
    this.btnEnviar = false;
    this.btnBlock = true;
    this.backend
      .put(
        `${environment.api}/Cotizacion/${this.idCotizacion}`,
        this.crearFormulario.value
      )
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.btnBlock = false;
            this.btnEnviar = true;
            alert('Se Editó con Éxito!');
            this.notificaciones.notificarNuevaCotizacion();
          });
          this.closeModal();
        },
        error: (error) => {
          this.btnBlock = false;
          this.btnEnviar = true;
          alert('Uno o mas campos son incorrectos');

          if (error.error == 'usuario no encontrado') {
            alert('Usuario no encontrado');
          } else {
            console.log(
              'Error al tratar de establecer comunicacion con el servidor'
            );
            console.log(error);
          }
        },
      });
  }

  closeModal() {
    this.dialogRef.close(); // Cierra el modal
  }
}
