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
  selector: 'app-agregar-empleado',
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
  providers: [MessageService,DatePipe],
  templateUrl: './agregar-empleado.component.html',
  styleUrl: './agregar-empleado.component.css',
})
export class AgregarEmpleadoComponent {
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR EMPLEADO';
  idEmpleado: any;
  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<AgregarEmpleadoComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
    this.crearFormulario = this.fb.group({
      idEmpleado: [0, Validators.required],
      idPersona: [0, Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: [0, Validators.required],
      direccion: ['', Validators.required],
      telefono: [0, Validators.required],
      sexo: [0, Validators.nullValidator],
      correo: ['', Validators.nullValidator],
      fechaNac: ['', Validators.nullValidator],
      estadoCivil: ['', Validators.nullValidator],
      formacionAcademica: ['', Validators.nullValidator],
      dpi: [0, Validators.required],
      altura: [0, Validators.required],
      peso: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.idEmpleado = this.DTO.getIdEmpleado();
    this.esEditar();
  }

  esEditar() {
    const id = this.idEmpleado.source._value;
    if (id !== 0) {
      this.tituloModal = 'EDITAR EMPLEADO';
      this.backend.get(`${environment.api}/empleado/${id}`).subscribe({
        next: (data: any) => {
          console.log(data);
          const datePipe = new DatePipe('en-US');
          const formattedFechaNac = datePipe.transform(
            data.fechaNac,
            'yyyy-MM-dd'
          );
          this.crearFormulario.setValue({
            idEmpleado: data.idEmpleado,
            idPersona: data.idPersona,
            nombre: data.nombre,
            apellido: data.apellido,
            edad: data.edad,
            direccion: data.direccion,
            telefono: data.telefono,
            sexo: data.sexo,
            correo: data.correo,
            fechaNac: formattedFechaNac,
            estadoCivil: data.estadoCivil,
            formacionAcademica: data.formacionAcademica,
            dpi: data.dpi,
            altura: data.altura,
            peso: data.peso,
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

    const id = this.idEmpleado.source._value;
    if (id == 0) {
      this.addEmpleado();
    } else {
      this.editEmpleado(id);
    }
  }

  addEmpleado() {
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
        .post(`${environment.api}/Empleado`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.closeModal();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Empleado creado correctamente',
              });
              this.btnBlock = false;
              this.btnEnviar = true;
              this.crearFormulario.reset();
              this.notificaciones.notificarNuevoEmpleado();
            });
          },
          error: (error) => {
            if (error.error == 'correo repetido') {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'El corrreo ya esta registrado',
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
  editEmpleado(id: any) {
    console.log(this.crearFormulario.value);
    this.btnBlock = true;
    this.btnEnviar = false;
    this.backend
      .put(`${environment.api}/Empleado/${id}`, this.crearFormulario.value)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.btnBlock = false;
            this.btnEnviar = true;

            this.notificaciones.notificarNuevoEmpleado();
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
