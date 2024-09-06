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
import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CrearPasajeroComponent } from '../crear-pasajero/crear-pasajero.component';

@Component({
  selector: 'app-asignar-pasajero',
  standalone: true,
  imports: [
    NgIf,
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
  templateUrl: './asignar-pasajero.component.html',
  styleUrl: './asignar-pasajero.component.css',
})
export class AsignarPasajeroComponent {
  pasajeros: any = [];
  reservas: any = [];
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR PASAJERO A RESERVA';

  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private router: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<AsignarPasajeroComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    public dialog: MatDialog,
  ) {
    this.crearFormulario = this.fb.group({
      idPersona: [0, Validators.required],
      idReserva: [0, Validators.required],
    });
  }
  ngOnInit(): void {
    this.getPasajeros();
    this.getReservas();
  }
  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'add') {
    
     this.openCrearPasajero();
    }
  }

  getPasajeros() {
    this.backend.get(`${environment.api}/Pasajero`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.pasajeros = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getReservas() {
    this.backend.get(`${environment.api}/Reserva`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.reservas = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  Asignar() {
    // const formValue = this.crearFormulario.value;
    // formValue.idPersona = Number(formValue.idPersona);
    // formValue.idReserva = Number(formValue.idReserva);
    console.log(this.crearFormulario.value);
    if (this.crearFormulario.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos',
      });
      return;
    } else {
      this.backend
        .post(`${environment.api}/PasajeroReserva`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Pasajero asignado correctamente',
            });
            this.closeModal();
          },
          error: (err) => {
            console.log(err);
            if (err.error == "El pasajero ya ha sido asignado a la reserva") {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'El pasajero ya ha sido asignado a la reserva',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al asignar pasajero, intente nuevamente',
              });
            }
          },
        });
    }
  }
  DesAsignar() {
    const idReserva = this.crearFormulario.value.idReserva;
    const idPasajero = this.crearFormulario.value.idPersona;
    console.log(this.crearFormulario.value);
    if (this.crearFormulario.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos',
      });
      return;
    } else {
      this.backend
        .delete(`${environment.api}/PasajeroReserva?idReserva=${idReserva}&idPasajero=${idPasajero}`)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Pasajero desasignado correctamente',
            });
            this.closeModal();
          },
          error: (err) => {
            console.log(err);
            if (err.error == "El pasajero proporcionado no está asignado a esta reserva") {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'El pasajero proporcionado no está asignado a esta reserva',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al desasignar pasajero, intente nuevamente',
              });
            }
          },
        });
    }
  }
  closeModal() {
    this.dialogRef.close(true); // Cierra el modal
  }
  ExitModal() {
    this.dialogRef.close(); // Cierra el modal
  }
  openCrearPasajero() {
   
    const dialogRef = this.dialog.open(CrearPasajeroComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Pasajero creado con éxito',
        });
        this.getPasajeros();
      }
      else{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear pasajero, intente nuevamente',
        });
      }
    });
  }
}
