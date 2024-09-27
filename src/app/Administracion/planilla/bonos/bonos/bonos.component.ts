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
  selector: 'app-bonos',
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
  templateUrl: './bonos.component.html',
  styleUrl: './bonos.component.css',
})
export class BonosComponent {
  listaPlanillas: any = [];
  listaBonos: any = [];
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'Asignar Bonos';
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
    public dialogRef: MatDialogRef<BonosComponent>
  ) {
    this.crearFormulario = this.fb.group({
      idPlanilla: ['', Validators.required],
      idBono: ['', Validators.required],
    });
    
   
  }
  ngOnInit(): void {
    this.notificaciones.nuevoBono$.subscribe(() => {
      this.getBonos();
    });
    this.getPlanillas();
    this.getBonos();
  }
  formulario() {
    if(this.crearFormulario.invalid){
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Debe seleccionar una planilla y un bono',
      });
    }
    else{
      this.backend
        .post(`${environment.api}/AsignarBono`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.dialogRef.close(true);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Bono Asignado Correctamente',
              });
              this.btnBlock = false;
              this.btnEnviar = true;
              this.crearFormulario.reset();
            });
          },
          error: (error) => {
            if (error.error == 'El bono ya ha sido asignado') {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'El bono ya ha sido asignado a la planilla',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'ocurrion un error al asignar el bono, intente nuevamente',
              });
            }
            console.log(error);
            this.btnBlock = false;
            this.btnEnviar = true;
          },
        });
    }
   
    
  }
  desAsignarBono() {
    let idPlanilla = this.crearFormulario.value.idPlanilla;
    let idBono = this.crearFormulario.value.idBono;
    this.backend
      .delete(`${environment.api}/AsignarBono?idPlanilla=${idPlanilla}&idBono=${idBono}`)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Bono Desasignado Correctamente',
            });
            this.btnBlock = false;
            this.btnEnviar = true;
            this.crearFormulario.reset({
              idPlanilla: '', // Restablece al valor inicial
              idBono: '' // Restablece al valor inicial
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
                'ocurrion un error al desasignar el bono, intente nuevamente',
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

  getBonos() {
    this.backend.get(`${environment.api}/Bono`).subscribe({
      next: (data: any) => {
        this.listaBonos = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deleteBono(){
    let id = this.crearFormulario.value.idBono;
    this.backend.delete(`${environment.api}/Bono/${id}`).subscribe({
      next: (data: any) => {
        this.getBonos();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Bono eliminado correctamente',
        });
        this.getBonos();
      },
      error: (error) => {
        if(error.error=="El bono está en uso dentro de una planilla")
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'El bono está en uso dentro de una planilla, primero desasigne todas sus referencias antes de poder eliminarlo',
        });
        else{
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el bono, intente nuevamente',
          });
        }
        console.error(error);
      },
    });

  }
 
}
