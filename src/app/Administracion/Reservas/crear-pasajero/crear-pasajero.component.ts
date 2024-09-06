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
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
@Component({
  selector: 'app-crear-pasajero',
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
    MessagesModule
  ],
  providers: [MessageService],
  templateUrl: './crear-pasajero.component.html',
  styleUrl: './crear-pasajero.component.css'
})
export class CrearPasajeroComponent {
  messages: Message[] | any;
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR PASAJERO';

  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<CrearPasajeroComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.crearFormulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: [, Validators.required],
      direccion: ['', Validators.required],
      telefono: [, Validators.required],
      sexo: [, Validators.required],
      correo: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      dpiCedula: ['', Validators.nullValidator]
    });
  }
  formulario(){
    this.backend.post(`${environment.api}/Pasajero`, this.crearFormulario.value)
    .subscribe({
      next: (data: any) => {
        console.log(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Pasajero creado correctamente',
        });
        this.closeModal();
      },
      error: (err) => {
        console.log(err);
        if (err.error == "Pasajero repetido") {
          this.messages = [{ severity: 'info', detail: 'Ya existe un pasajero con el mismo numero de DPI o cédula' }];
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear pasajero, intente nuevamente',
          });
        }
      },
    });
  }
  closeModal() {
    this.dialogRef.close(true); // Cierra el modal
  }

}
