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
  selector: 'app-agregar-vehiculos',
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
  templateUrl: './agregar-vehiculos.component.html',
  styleUrl: './agregar-vehiculos.component.css'
})
export class AgregarVehiculosComponent {
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR VEHICULO';
  idVehiculo: any;
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
    public dialogRef: MatDialogRef<AgregarVehiculosComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.crearFormulario = this.fb.group({
      idVehiculo: [0, Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      placa: ['', Validators.required],
      color: ['', Validators.required],
      capacidadPasajeros: [0, Validators.required],
      X: [true, Validators.required],
      estado: [true, Validators.required],
    });
  }
  ngOnInit(): void {
    this.idVehiculo = this.DTO.getIdVehiculo();
    this.esEditar();
  }

  esEditar() {
    const id = this.idVehiculo.source._value;
    if (id !== 0) {
      this.editando = true;
      this.tituloModal = 'EDITAR VEHICULO';
      this.backend.get(`${environment.api}/Vehiculo/${id}`).subscribe({
        next: (data: any) => {
          this.crearFormulario.setValue({
            idVehiculo: data.idVehiculo,
            marca: data.marca,
            modelo: data.modelo,
            placa: data.placa,
            color: data.color,
            capacidadPasajeros: data.capacidadPasajeros,
            estado: data.estado,
            X: '',
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
   
    const id = this.idVehiculo.source._value;
    if (id == 0) {
     
      this.addVehiculo();
    } else {
      this.editVehiculo(id);
      
    }
  }

  addVehiculo() {
    if(this.crearFormulario.value.X == 1){
      this.crearFormulario.value.estado = true;
    }
    else{
      this.crearFormulario.value.estado = false;
    }
    console.log(this.crearFormulario.value);

    if (this.crearFormulario.invalid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Complete el formulario',
      });
    } else {
      // Convertir idDestino e idSalida a enteros
      this.btnEnviar = false;
      this.btnBlock = true;
      this.backend
        .post(`${environment.api}/Vehiculo`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.closeModal();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Vehiculo agregado correctamente',
              });
              this.btnBlock = false;
              this.btnEnviar = true;
              this.crearFormulario.reset();
              this.notificaciones.notificarNuevoVehiculo();
            });
          },
          error: (error) => {
            console.log(error)
            this.btnBlock = false;
            this.btnEnviar = true;

            if (error.error == 'Placa repetida') {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Ya existe un vehiculo con la misma placa',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'ocurrion un error al crear, intente nuevamente',
              });
            }
          },
        });
    }
  }
  editVehiculo(id: any) {
    if (this.crearFormulario.value.estado == 'true') {
      this.crearFormulario.controls['estado'].setValue(true);
    }

    if (this.crearFormulario.value.estado == 'false') {
      this.crearFormulario.controls['estado'].setValue(false);
    }

    this.crearFormulario.removeControl('X');
    console.log(this.crearFormulario.value);
    this.backend
      .put(`${environment.api}/Vehiculo/${id}`, this.crearFormulario.value)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.btnBlock = false;
            this.btnEnviar = true;

            this.notificaciones.notificarNuevoVehiculo();
          });
          this.closeModal();
        },
        error: (error) => {
          this.btnBlock = false;
          this.btnEnviar = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al editar',
          });
        },
      });
  }

  closeModal() {
    this.dialogRef.close(true); // Cierra el modal
  }

}
