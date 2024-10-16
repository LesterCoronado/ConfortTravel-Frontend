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
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-Descuentos',
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
    CommonModule
  ],
  providers: [MessageService, DatePipe],
  templateUrl: './descuentos.component.html',
  styleUrl: './descuentos.component.css',
})
export class DescuentosComponent {
  listaPlanillas: any = [];
  listaDescuentos: any = [];
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'Asignar Descuentos';
  crearFormulario: FormGroup;


  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<DescuentosComponent>
  ) {
    this.crearFormulario = this.fb.group({
      idPlanilla: ['', Validators.required],
      idDescuento: ['', Validators.required],
    });
    
   
  }
  ngOnInit(): void {
    this.notificaciones.nuevoDescuento$.subscribe(() => {
      this.getDescuentos();
    });
    this.getPlanillas();
    this.getDescuentos();
  }
  formulario() {
    if(this.crearFormulario.invalid){
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Debe seleccionar una planilla y un descuento',
      });
    }
    else{
      this.backend
        .post(`${environment.api}/AsignarDescuento`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.dialogRef.close(true);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'descuento Asignado Correctamente',
              });
              this.btnBlock = false;
              this.btnEnviar = true;
              this.crearFormulario.reset();
            });
          },
          error: (error) => {
            if (error.error == 'El descuento ya ha sido asignado') {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'El descuento ya ha sido asignado a la planilla',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'ocurrion un error al asignar el descuento, intente nuevamente',
              });
            }
            console.log(error);
            this.btnBlock = false;
            this.btnEnviar = true;
          },
        });
    }
   
    
  }
  desAsignarDescuento() {
    let idPlanilla = this.crearFormulario.value.idPlanilla;
    let idDescuento = this.crearFormulario.value.idDescuento;
    this.backend
      .delete(`${environment.api}/AsignarDescuento?idPlanilla=${idPlanilla}&idDescuento=${idDescuento}`)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'descuento Desasignado Correctamente',
            });
            this.btnBlock = false;
            this.btnEnviar = true;
            this.crearFormulario.reset({
              idPlanilla: '', // Restablece al valor inicial
              idDescuento: '' // Restablece al valor inicial
            });
          });
        },
        error: (error) => {
          if (error.error == 'No se encontró tal asignación') {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'No se encontró tal asignación',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'ocurrion un error al desasignar el descuento, intente nuevamente',
            });
          }
          console.log(error);
          this.btnBlock = false;
          this.btnEnviar = true;
        },
      });
  }
  ExitModal() {
    this.dialogRef.close(); // Cierra el modal
  }

  getPlanillas() {
    this.backend.get(`${environment.api}/Planilla`).subscribe({
      next: (data: any) => {
        this.listaPlanillas = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getDescuentos() {
    this.backend.get(`${environment.api}/Descuento`).subscribe({
      next: (data: any) => {
        this.listaDescuentos = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deleteDescuento(){
    let id = this.crearFormulario.value.idDescuento;
    this.backend.delete(`${environment.api}/Descuento/${id}`).subscribe({
      next: (data: any) => {
        this.getDescuentos();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'descuento eliminado correctamente',
        });
        this.getDescuentos();
      },
      error: (error) => {
        if(error.error=="El descuento está en uso dentro de una planilla")
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'El descuento está en uso dentro de una planilla, primero desasigne todas sus referencias antes de poder eliminarlo',
        });
        else{
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el descuento, intente nuevamente',
          });
        }
        console.error(error);
      },
    });

  }
 
}
