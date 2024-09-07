import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { environment } from '../../../environments/environments.prod';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { DTOService } from '../../../services/dto.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'app-agregar-reservas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgFor,
    MatIconModule,
    MatButtonModule,
    ToastModule,
    ButtonModule,
    RippleModule,
  ],
  providers: [MessageService],
  templateUrl: './agregar-reservas.component.html',
  styleUrl: './agregar-reservas.component.css',
})
export class AgregarReservasComponent {
  reservas: any = [];
  paquetes: any = [];
  vehiculos: any = [];
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR RESERVA';
  idReserva: any;
  editando: boolean = false;
  estados = [
    {
      nombre: 'Activo',
      estado: true,
      valorId: 1,
    },
    {
      nombre: 'Inactivo',
      estado: false,
      valorId: 0,
    },
  ]; //estado del destino

  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<AgregarReservasComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.crearFormulario = this.fb.group({
      idReserva: [0, Validators.required],
      idPaqueteViaje: [0, Validators.required],
      idVehiculo: [0, Validators.required],
      fechaSalida: ['', Validators.required],
      horaSalida: ['', Validators.required],
      fechaRetorno: ['', Validators.required],
      horaRetorno: ['', Validators.required],
      totalDias: [0, Validators.required],
      observaciones: ['', Validators.nullValidator],
      X: [true, Validators.required],
      estado: [true, Validators.required],
    });
  }
  ngOnInit(): void {
    this.idReserva = this.DTO.getIdReserva();
    this.esEditar();
    this.getPaquetes();
    this.getVehiculos();
  }

  getPaquetes(){
    this.backend.get(`${environment.api}/Paquete`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.paquetes = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getVehiculos(){
    this.backend.get(`${environment.api}/Vehiculo`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.vehiculos = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  esEditar() {
    const id = this.idReserva.source._value;
    if (id !== 0) {
      this.editando = true;
      this.tituloModal = 'EDITAR RESERVA';
      this.backend.get(`${environment.api}/Reserva/${id}`).subscribe({
        next: (data: any) => {
          console.log(data);
          this.crearFormulario.setValue({
            idReserva: data.idReserva,
            idPaqueteViaje: data.idPaqueteViaje,
            idVehiculo: data.idVehiculo,
            fechaSalida: data.fechaSalida,
            horaSalida: data.horaSalida,
            fechaRetorno: data.fechaRetorno,
            horaRetorno: data.horaRetorno,
            totalDias: data.totalDias,
            observaciones: data.observaciones,
            X: '',
            estado: data.estado,
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  formulario() {
    const formValues = this.crearFormulario.value;

    const id = this.idReserva.source._value;
    if (id == 0) {
      this.addReserva();
    } else {
      this.editReserva(id);
    }
  }

  addReserva() {
    if (this.crearFormulario.value.X == 1) {
      this.crearFormulario.value.estado = true;
    } else {
      this.crearFormulario.value.estado = false;
    }

    if (this.crearFormulario.invalid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Complete el formulario',
      });
    } else {

      console.log(this.crearFormulario.value)
      this.btnEnviar = false;
      this.btnBlock = true;

      this.backend
        .post(`${environment.api}/Reserva`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.closeModal();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Reserva agregada correctamente',
              });
              this.btnBlock = false;
              this.btnEnviar = true;
              this.crearFormulario.reset();
              this.notificaciones.notificarNuevaReserva();
            });
          },
          error: (error) => {
            if(error.error == "El vehículo no está disponible en las fechas seleccionadas"){
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail:
                  'El vehículo no está disponible en las fechas seleccionadas',
              });
            }
            else{
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'ocurrion un error al crear la reserva, intente nuevamente',
              });
            }
            console.log(error);
            this.btnBlock = false;
            this.btnEnviar = true;

            
          },
        });
    }
  }
  editReserva(id: any) {
    if (this.crearFormulario.value.estado == 'true') {
      this.crearFormulario.controls['estado'].setValue(true);
    }

    if (this.crearFormulario.value.estado == 'false') {
      this.crearFormulario.controls['estado'].setValue(false);
    }

    this.crearFormulario.removeControl('X');
    console.log(this.crearFormulario.value);
    this.backend
      .put(`${environment.api}/Reserva/${id}`, this.crearFormulario.value)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.btnBlock = false;
            this.btnEnviar = true;

            this.notificaciones.notificarNuevaReserva();
          });
          this.closeModal();
        },
        error: (error) => {
          this.btnBlock = false;
          this.btnEnviar = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al editar, intente nuevamente',
          });
        },
      });
  }
  closeModal() {
    this.dialogRef.close(true); // Cierra el modal
  }

  ExitModal() {
    this.dialogRef.close(); // Cierra el modal
  }
}
