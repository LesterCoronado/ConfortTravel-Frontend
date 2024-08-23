import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../../../services/backend.service';
import { environment } from '../../../../environments/environments.prod';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { DTOService } from '../../../../services/dto.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificacionesService } from '../../../../services/notificaciones.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-agregar-incluye',
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
  templateUrl: './agregar-incluye.component.html',
  styleUrl: './agregar-incluye.component.css',
})
export class AgregarIncluyeComponent {
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR';
  idPaquete: any;
  idIncluye: any;
  editando: boolean = false;
  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<AgregarIncluyeComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private cookie: CookieService
  ) {
    this.crearFormulario = this.fb.group({
      idPaqueteIncluye: [0, Validators.required],
      idPaqueteViaje: [0, Validators.required],
      incluye: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.esEditar();
    this.idPaquete = this.cookie.get('idPaquete');
    this.idIncluye = this.DTO.getIdIncluye();
    this.esEditar();
  }
  esEditar() {
    const id = this.idIncluye.source._value;
    if (id !== 0) {
      this.editando = true;
      this.tituloModal = 'EDITAR';
      this.backend
        .get(`${environment.api}/PaqueteIncluye/editar/${id}`)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.crearFormulario.setValue({
              idPaqueteIncluye: data[0].idPaqueteIncluye,
              idPaqueteViaje: data[0].idPaqueteViaje,
              incluye: data[0].incluye,
            });
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  formulario() {
    let id = this.idIncluye.source._value;
    if (id == 0) {
      this.addIncluye();
    } else {
      this.editIncluye(id);
    }
  }

  addIncluye() {
    console.log(this.idPaquete);
    this.crearFormulario.controls['idPaqueteViaje'].setValue(this.idPaquete);
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
        .post(`${environment.api}/PaqueteIncluye`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.ngZone.run(() => {
              this.closeModal();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Actividad agregada correctamente',
              });
              this.btnBlock = false;
              this.btnEnviar = true;
              this.crearFormulario.reset();
              this.notificaciones.notificarNuevoIncluye();
            });
          },
          error: (error) => {
            console.log(error);
            this.btnBlock = false;
            this.btnEnviar = true;

            if (error.error == 'Ya existe un registro que contiene lo mismo') {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Ya existe un registro que contiene lo mismo',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'ocurrion un error al crear, intente nuevamente',
              });
            }
          },
        });
    }
  }
  editIncluye(id: any) {
    console.log(this.crearFormulario.value);
    this.backend
      .put(`${environment.api}/PaqueteIncluye/${id}`, this.crearFormulario.value)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.btnBlock = false;
            this.btnEnviar = true;

            this.notificaciones.notificarNuevoIncluye();
          });
          this.closeModal();
        },
        error: (error) => {
          console.log(error);
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
}
