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
  selector: 'app-agregar-salidas',
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
  templateUrl: './agregar-salidas.component.html',
  styleUrl: './agregar-salidas.component.css',
})
export class AgregarSalidasComponent {
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR DESTINO';
  idSalida: any;
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
    public dialogRef: MatDialogRef<AgregarSalidasComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.crearFormulario = this.fb.group({
      idSalida: [0, Validators.required],
      direccion: ['', Validators.required],
      X: [true, Validators.required],
      estado: [true, Validators.required],
    });
  }
  ngOnInit(): void {
    this.idSalida = this.DTO.getIdSalida();
    this.esEditar();
  }

  esEditar() {
    const id = this.idSalida.source._value;
    if (id !== 0) {
      this.editando = true;
      this.tituloModal = 'EDITAR SALIDA';
      this.backend.get(`${environment.api}/Salida/${id}`).subscribe({
        next: (data: any) => {
          this.crearFormulario.setValue({
            idSalida: data.idSalida,
            direccion: data.direccion,
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
   
    const id = this.idSalida.source._value;
    if (id == 0) {
     
      this.addSalida();
    } else {
 
      this.editSalida(id);
    }
  }

  addSalida() {
    if(this.crearFormulario.value.X == 1){
      this.crearFormulario.value.estado = true;
    }
    else{
      this.crearFormulario.value.estado = false;
    }
    // this.crearFormulario.removeControl('X');

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
        .post(`${environment.api}/Salida`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.closeModal();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Salida agregada correctamente',
              });
              this.btnBlock = false;
              this.btnEnviar = true;
              this.crearFormulario.reset();
              this.notificaciones.notificarNuevaSalida();
            });
          },
          error: (error) => {
            this.btnBlock = false;
            this.btnEnviar = true;

            if (error.error == 'La salida ya existe') {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Ya existe una salida con este nombre',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'ocurrion un error al crear la salida, intente nuevamente',
              });
            }
          },
        });
    }
  }
  editSalida(id: any) {
    if(this.crearFormulario.value.estado == 'true'){
      this.crearFormulario.controls['estado'].setValue(true);
     
    }
    else{
      this.crearFormulario.controls['estado'].setValue(false);

    }
    this.crearFormulario.removeControl('X');
    console.log(this.crearFormulario.value);
    this.backend
      .put(`${environment.api}/Salida/${id}`, this.crearFormulario.value)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.btnBlock = false;
            this.btnEnviar = true;

            this.notificaciones.notificarNuevaSalida();
          });
          this.closeModal();
        },
        error: (error) => {
          this.btnBlock = false;
          this.btnEnviar = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al editar la salida',
          });
        },
      });
  }
  closeModal() {
    this.dialogRef.close(true); // Cierra el modal
  }
}
