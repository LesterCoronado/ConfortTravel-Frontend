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
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-agregar-planilla',
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
  providers: [MessageService, DatePipe],
  templateUrl: './agregar-planilla.component.html',
  styleUrl: './agregar-planilla.component.css',
})
export class AgregarPlanillaComponent {
  listaEmpleados: any = [];
  listaCargoLaboral: any = [];
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR PLANILLA';
  idPlanilla: any;
  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<AgregarPlanillaComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    this.crearFormulario = this.fb.group({
      idPlanilla: [0, Validators.nullValidator],
      idEmpleado: [0, Validators.required],
      fechaContratacion: ['', Validators.required],
      fechaDeBaja: [null, Validators.nullValidator],
      tipoContrato: ['', Validators.required],
      tiempoContrato: [, Validators.nullValidator],
      idCargo: [0, Validators.required],
      salarioBase: [0, Validators.nullValidator],
      noCuenta: [0, Validators.nullValidator],
      estado: [true, Validators.required],
    });
  }
  ngOnInit(): void {
    this.idPlanilla = this.DTO.getIdPlanilla();
    this.esEditar();
    this.getEmpleados();
    this.getCargoLaboral();
  }
  getCargoLaboral() {
    this.backend.get(`${environment.api}/CargoLaboral`).subscribe({
      next: (data: any) => {
        this.listaCargoLaboral = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getEmpleados() {
    this.backend.get(`${environment.api}/Empleado`).subscribe({
      next: (data: any) => {
        this.listaEmpleados = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  esEditar() {
  
    const id = this.idPlanilla.source._value;
    if (id !== 0) {
      this.tituloModal = 'EDITAR PLANILLA';
      this.backend.get(`${environment.api}/planilla/${id}`).subscribe({
        next: (data: any) => {
          console.log(data);
          const datePipe = new DatePipe('en-US');
          const formattedFechaContratacion = datePipe.transform(
            data.fechaContratacion,
            'yyyy-MM-dd'
          );
          const formattedFechaDeBaja = datePipe.transform(
            data.fechaDeBaja,
            'yyyy-MM-dd'
          );
          this.crearFormulario.setValue({
            idPlanilla: data.idPlanilla,
            idEmpleado: data.idEmpleado,
            fechaContratacion: formattedFechaContratacion,
            fechaDeBaja: formattedFechaDeBaja,
            tipoContrato: data.tipoContrato,
            tiempoContrato: data.tiempoContrato,
            idCargo: data.idCargo,
            salarioBase: data.salarioBase,
            noCuenta: data.noCuenta,
            estado: data.estado,
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

    const id = this.idPlanilla.source._value;
    if (id == 0) {
      this.addPlanilla();
    } else {
      this.editPlanilla(id);
    }
  }

  addPlanilla() {
    if (this.crearFormulario.get('fechaDeBaja')?.value === '') {
      this.crearFormulario.patchValue({
        fechaDeBaja: null,
      });
    }
    console.log(this.crearFormulario.value);
    if (this.crearFormulario.invalid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Complete el formulario',
      });
    } else {
      console.log(this.crearFormulario.value);
      this.btnEnviar = false;
      this.btnBlock = true;

      this.backend
        .post(`${environment.api}/Planilla`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.closeModal();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Planilla creada correctamente',
              });
              this.btnBlock = false;
              this.btnEnviar = true;
              this.crearFormulario.reset();
              this.notificaciones.notificarNuevaPlanilla();
            });
          },
          error: (error) => {
            if (
              error.error == 'Este empleado ya ha sido agregado a la planilla'
            ) {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Este empleado ya ha sido agregado a la planilla',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'ocurrion un error al crear el empleado, intente nuevamente',
              });
            }
            console.log(error);
            this.btnBlock = false;
            this.btnEnviar = true;
          },
        });
    }
  }
  editPlanilla(id: any) {
    if (this.crearFormulario.get('fechaDeBaja')?.value === '') {
      this.crearFormulario.patchValue({
        fechaDeBaja: null,
      });
    }
    console.log(this.crearFormulario.value);
    this.btnBlock = true;
    this.btnEnviar = false;
    this.backend
      .put(`${environment.api}/Planilla/${id}`, this.crearFormulario.value)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.btnBlock = false;
            this.btnEnviar = true;

            this.notificaciones.notificarNuevaPlanilla();
          });
          this.closeModal();
        },
        error: (error) => {
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

  ExitModal() {
    this.dialogRef.close(); // Cierra el modal
  }
}
