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
@Component({
  selector: 'app-editar-paquete',
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
  templateUrl: './editar-paquete.component.html',
  styleUrl: './editar-paquete.component.css',
})
export class EditarPaqueteComponent {
  salidas: any = [];
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR PAQUETE';
  idPaquete: any;
  editando: boolean = false;
  estados = [
    {
      nombre: 'Activo',
      estado: true,
      valorId: 1,
    },
    {
      nombre: 'Inactivo',
      estado: false,
      valorId: 0,
    },
  ]; //estado del destino
  uploadedFiles: File[] = [];
  previsualizacion: string = '';
  public archivos: any = [];
  cargandoImagen = false;
  esFotoValida: boolean = true;
  urlFoto: string = '';

  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<EditarPaqueteComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.crearFormulario = this.fb.group({
      idPaqueteViaje: [0, Validators.required],
      titulo: ['', Validators.required],
      portada: ['', Validators.required],
      descripcion: ['', Validators.required],
      modalidadPaquete: ['', Validators.required],
      idSalida: [0, Validators.required],
      totalDias: [0, Validators.required],
      totalNoches: [0, Validators.required],
      minPax: [0, Validators.required],
      maxPax: [0, Validators.required],
      politicaCancelacion: ['', Validators.required],
      X: [true, Validators.required],
      estado: [true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.idPaquete = this.DTO.getIdPaquete();
    this.esEditar();
    this.getSalidas();
  }

  esEditar() {
    const id = this.idPaquete.source._value;
    if (id !== 0) {
      this.editando = true;
      this.tituloModal = 'EDITAR PAQUETE';
      this.backend.get(`${environment.api}/Paquete/${id}`).subscribe({
        next: (data: any) => {
          console.log(data);
          this.crearFormulario.setValue({
            idPaqueteViaje: data[0].idPaquete,
            titulo: data[0].titulo,
            portada: '',
            descripcion: data[0].descripcion,
            modalidadPaquete: data[0].modalidadPaquete,
            idSalida: data[0].idSalida,
            totalDias: data[0].totalDias,
            totalNoches: data[0].totalNoches,
            minPax: data[0].minPax,
            maxPax: data[0].maxPax,
            politicaCancelacion: data[0].politicaCancelacion,
            estado: data[0].estado,
            X: '',
          });
          this.previsualizacion = data[0].portada;
          this.urlFoto = data[0].portada;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  formulario() {
    const formValues = this.crearFormulario.value;

    const id = this.idPaquete.source._value;
    if (id == 0) {
      this.addPaquete();
    } else {
      this.editPaquete(id);
    }
  }

  addPaquete() {
    this.btnBlock = true;
    this.btnEnviar = false;
    if (this.crearFormulario.value.X == 1) {
      this.crearFormulario.value.estado = true;
    } else {
      this.crearFormulario.value.estado = false;
    }
    // this.crearFormulario.removeControl('X');

    if (this.crearFormulario.invalid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Complete el formulario',
      });
    } else {
      this.btnEnviar = false;
      this.btnBlock = true;
      this.crearFormulario.value.portada = this.previsualizacion;
      this.backend
        .post(`${environment.api}/Paquete`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.closeModal();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Paquete agregado correctamente',
              });
              this.btnBlock = false;
              this.btnEnviar = true;
              this.crearFormulario.reset();
              this.notificaciones.notificarNuevoPaquete();
            });
          },
          error: (error) => {
            this.btnBlock = false;
            this.btnEnviar = true;

            if (error.error == 'El paquete ya existe') {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Ya existe un paquete con este nombre',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'ocurrion un error al crear el paquete, intente nuevamente',
              });
            }
          },
        });
    }
  }
  editPaquete(id: any) {
    this.btnBlock = true;
    this.btnEnviar = false;
    if (this.crearFormulario.value.estado == 'true') {
      this.crearFormulario.controls['estado'].setValue(true);
    }

    if (this.crearFormulario.value.estado == 'false') {
      this.crearFormulario.controls['estado'].setValue(false);
    }

    this.crearFormulario.removeControl('X');
    console.log(this.crearFormulario.value);
    this.crearFormulario.value.portada = this.previsualizacion;
    this.backend
      .put(`${environment.api}/Paquete/${id}`, this.crearFormulario.value)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.btnBlock = false;
            this.btnEnviar = true;

            this.notificaciones.notificarNuevoPaquete();
          });
          this.closeModal();
        },
        error: (error) => {
          this.btnBlock = false;
          this.btnEnviar = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al editar el paquete, intente de nuevo',
          });
        },
      });
  }
  getSalidas() {
    this.backend.get(`${environment.api}/Salida`).subscribe({
      next: (data: any) => {
        this.salidas = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  capturarFile(event: any): any {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];

      if (
        file.type == 'image/jpeg' ||
        file.type == 'image/png' ||
        file.type == 'image/jpeg'
      ) {
        this.previsualizacion = '';
        this.esFotoValida = true;
        this.cargandoImagen = true; // Mostrar el loader
        const archivoCapturado = event.target.files[0];
        this.extraerBase64(archivoCapturado).then((imagen: any) => {
          this.previsualizacion = imagen.base;
          this.cargandoImagen = false; // Ocultar el loader después de cargar la imagen
          this.archivos.push(archivoCapturado);
          this.crearFormulario.value.imagen = imagen.base;
        });
      } else {
        this.previsualizacion = '';
        this.cargandoImagen = false; // Ocultar el loader en caso de error
        this.esFotoValida = false;
      }
    }
  }

  extraerBase64 = async ($event: any) => {
    return new Promise((resolve: any) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        const reader = new FileReader();

        reader.readAsDataURL($event);
        reader.onload = () => {
          // Resolvemos con la URL de la vista previa
          resolve({
            base: reader.result,
          });

          // Ocultamos el loader y mostramos la previsualización
          this.previsualizacion = reader.result as string;
        };

        reader.onerror = (error) => {
          // Manejar errores aquí (puedes mostrar un mensaje de error)
          resolve({
            base: null,
          });
        };
      } catch (e) {
        resolve({
          base: null,
        });
      }
    });
  };
  clearImage(): any {
    this.crearFormulario.controls['portada'].setValue('');
    this.previsualizacion = '';
    this.archivos = [];
    this.esFotoValida = true;
  }
  closeModal() {
    this.dialogRef.close(true); // Cierra el modal
  }
}
