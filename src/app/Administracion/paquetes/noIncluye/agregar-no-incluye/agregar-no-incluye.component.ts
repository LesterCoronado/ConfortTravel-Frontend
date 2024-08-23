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
  templateUrl: './agregar-no-incluye.component.html',
  styleUrl: './agregar-no-incluye.component.css',
})
export class AgregarNoIncluyeComponent {
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR';
  idPaquete: any;
  idNoIncluye: any;
  editando: boolean = false;
  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<AgregarNoIncluyeComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private cookie: CookieService
  ) {
    this.crearFormulario = this.fb.group({
      idPaqueteNoIncluye: [0, Validators.required],
      idPaqueteViaje: [0, Validators.required],
      noIncluye: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.esEditar();
    this.idPaquete = this.cookie.get('idPaquete');
    this.idNoIncluye = this.DTO.getIdNoIncluye();
    this.esEditar();
  }
  esEditar() {
    const id = this.idNoIncluye.source._value;
    if (id !== 0) {
      this.editando = true;
      this.tituloModal = 'EDITAR';
      this.backend
        .get(`${environment.api}/PaqueteNoIncluye/editar/${id}`)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.crearFormulario.setValue({
              idPaqueteNoIncluye: data[0].idPaqueteNoIncluye,
              idPaqueteViaje: data[0].idPaqueteViaje,
              noIncluye: data[0].noIncluye,
            });
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  formulario() {
    let id = this.idNoIncluye.source._value;
    if (id == 0) {
      this.addNoIncluye();
    } else {
      this.editNoIncluye(id);
    }
  }

  addNoIncluye() {
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
        .post(`${environment.api}/PaqueteNoIncluye`, this.crearFormulario.value)
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
              this.notificaciones.notificarNuevoNoIncluye();
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
  editNoIncluye(id: any) {
    console.log(this.crearFormulario.value);
    this.backend
      .put(`${environment.api}/PaqueteNoIncluye/${id}`, this.crearFormulario.value)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.btnBlock = false;
            this.btnEnviar = true;

            this.notificaciones.notificarNuevoNoIncluye();
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
