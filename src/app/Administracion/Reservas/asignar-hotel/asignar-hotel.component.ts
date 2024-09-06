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

@Component({
  selector: 'app-asignar-hotel',
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
  templateUrl: './asignar-hotel.component.html',
  styleUrl: './asignar-hotel.component.css'
})
export class AsignarHotelComponent {
  hoteles: any = [];
  reservas: any = [];
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR ALOJAMIENTO A RESERVA';

  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private router: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<AsignarHotelComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    public dialog: MatDialog,
  ) {
    this.crearFormulario = this.fb.group({
      idHotel: [0, Validators.required],
      idReserva: [0, Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      
    });
  }

  ngOnInit(): void {
    this.getHoteles();
    this.getReservas();
  }
  
  getHoteles() {
    this.backend.get(`${environment.api}/Hotel`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.hoteles = data;
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
        .post(`${environment.api}/HotelReserva`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Hotel asignado correctamente',
            });
            this.closeModal();
          },
          error: (err) => {
            console.log(err);
            if (err.error == "El Hotel ya ha sido asignado a la reserva") {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'El Hotel ya ha sido asignado a la reserva',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al asignar Hotel, intente nuevamente',
              });
            }
          },
        });
    }
  }
  DesAsignar() {
    const idReserva = this.crearFormulario.value.idReserva;
    const idHotel = this.crearFormulario.value.idHotel;
    console.log(this.crearFormulario.value);
    if (this.crearFormulario.value.idReserva == 0 || this.crearFormulario.value.idHotel == 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'info',
        detail: 'Por favor, seleccione una reserva y un hotel',
      });
      return;
    } else {
      this.backend
        .delete(`${environment.api}/HotelReserva?idReserva=${idReserva}&idHotel=${idHotel}`)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Hotel desasignado correctamente',
            });
            this.closeModal();
          },
          error: (err) => {
            console.log(err);
            if (err.error == "El hotel proporcionado no está asignado a esta reserva") {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'El hotel proporcionado no está asignado a esta reserva',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al desasignar hotel, intente nuevamente',
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
  

}
