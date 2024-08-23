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
  selector: 'app-agregar-itinerario',
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
  templateUrl: './agregar-itinerario.component.html',
  styleUrl: './agregar-itinerario.component.css',
})
export class AgregarItinerarioComponent {
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'NUEVA ACTIVIDAD';
  idPaquete: any;
  idItinerario: any;
  editando: boolean = false;

  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<AgregarItinerarioComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private cookie: CookieService
  ) {
    this.crearFormulario = this.fb.group({
      idPaqueteItinerario: [0, Validators.required],
      idPaqueteViaje: [0, Validators.required],
      actividad: ['', Validators.required],
      descripcion: ['', Validators.required],
      horario: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.idItinerario= this.DTO.getIdItineario();
    // let id = this.idPaquete.source._value;
    this.esEditar();
  }
  esEditar() {
    const id = this.idItinerario.source._value;
    if (id !== 0) {
      this.editando = true;
      this.tituloModal = 'EDITAR';
      this.backend
        .get(`${environment.api}/Itinerario/editar/${id}`)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.crearFormulario.setValue({
              idPaqueteItinerario: data[0].idPaqueteItinerario,
              idPaqueteViaje: data[0].idPaqueteViaje,
              actividad: data[0].actividad,
              descripcion: data[0].descripcion,
              horario: data[0].horario
            });
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  formulario() {
    let id = this.idItinerario.source._value;
    if (id == 0) {
      this.addItinerario();
    } else {
      this.edditItinerario(id);
    }
  }
  addItinerario() {
    console.log(this.crearFormulario.value);
    let _idPaquete: any = this.cookie.get('idPaquete');

    this.crearFormulario.controls['idPaqueteViaje'].setValue(_idPaquete);
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
        .post(`${environment.api}/Itinerario`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.closeModal();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Activiadad agregada correctamente al itinerario',
              });
              this.btnBlock = false;
              this.btnEnviar = true;
              this.crearFormulario.reset();
              this.notificaciones.notificarNuevoItinerario();
            });
          },
          error: (error) => {
            console.log(error);
            this.btnBlock = false;
            this.btnEnviar = true;

            if (error.error == 'actividad repetida') {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Ya existe una actividad con este nombre',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'ocurrion un error al crear la activida, intente nuevamente',
              });
            }
          },
        });
    }
  }
  edditItinerario(id: any) { 
    console.log(this.crearFormulario.value);
    this.backend
      .put(`${environment.api}/Itinerario/${id}`, this.crearFormulario.value)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.btnBlock = false;
            this.btnEnviar = true;

            this.notificaciones.notificarNuevoItinerario();
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
