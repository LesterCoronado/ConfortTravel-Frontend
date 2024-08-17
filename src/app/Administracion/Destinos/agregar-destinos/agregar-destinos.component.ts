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
import { relativeTimeThreshold } from 'moment';

@Component({
  selector: 'app-agregar-destinos',
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
  templateUrl: './agregar-destinos.component.html',
  styleUrl: './agregar-destinos.component.css',
})
export class AgregarDestinosComponent {
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR DESTINO';
  idDestino: any;
  uploadedFiles: File[] = [];
  previsualizacion: string = '';
  public archivos: any = [];
  cargandoImagen = false;
  esFotoValida: boolean = true;
  urlFoto: string = '';

  estados = [
    {
      nombre: 'Activo',
      valor: true,
      valorId: 1,
    },
    {
      nombre: 'Inactivo',
      valor: false,
      valorId: 0,
    },
  ]; //estado del destino

  paisesConDepartamentos = [
    {
      pais: 'Guatemala',
      departamentos: [
        'Alta Verapaz',
        'Baja Verapaz',
        'Chimaltenango',
        'Chiquimula',
        'El Progreso',
        'Escuintla',
        'Guatemala',
        'Huehuetenango',
        'Izabal',
        'Jalapa',
        'Jutiapa',
        'Petén',
        'Quetzaltenango',
        'Quiché',
        'San Marcos',
        'Santa Rosa',
        'Solalá',
        'Suchitepéquez',
        'Totonicapán',
        'Zacapa',
      ],
    },
    {
      pais: 'Mexico',
      departamentos: [
        'Aguascalientes',
        'Baja California',
        'Baja California Sur',
        'Campeche',
        'Chiapas',
        'Chihuahua',
        'Coahuila',
        'Colima',
        'Durango',
        'Guanajuato',
        'Guerrero',
        'Hidalgo',
        'Jalisco',
        'Mexico',
        'Mexico City',
        'Michoacán',
        'Morelos',
        'Nayarit',
        'Nuevo León',
        'Oaxaca',
        'Puebla',
        'Querétaro',
        'Quintana Roo',
        'San Luis Potosí',
        'Sinaloa',
        'Sonora',
        'Tabasco',
        'Tamaulipas',
        'Tlaxcala',
        'Veracruz',
        'Yucatán',
        'Zacatecas',
      ],
    },
    {
      pais: 'Belice',
      departamentos: [
        'Belize',
        'Cayo',
        'Corozal',
        'Orange Walk',
        'Stann Creek',
        'Toledo',
      ],
    },
  ];
  departamentos: string[] = [];

  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<AgregarDestinosComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.crearFormulario = this.fb.group({
      idDestino: [0, Validators.required],
      nombre: ['', Validators.required],
      pais: ['', Validators.required],
      depto: ['', Validators.required],
      direccion: ['', Validators.required],
      imagen: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.idDestino = this.DTO.getIdDestino();

    this.esEditar();
    this.crearFormulario.get('pais')?.valueChanges.subscribe((pais) => {
      this.updateDepartamentos(pais);
    });
  }
  esEditar() {
    const id = this.idDestino.source._value;
    if (id !== 0) {
      this.tituloModal = 'EDITAR DESTINO';
      this.backend.get(`${environment.api}/Destino/${id}`).subscribe({
        next: (data: any) => {
          this.crearFormulario.setValue({
            idDestino: data.idDestino,
            nombre: data.nombre,
            pais: data.pais,
            depto: data.depto, // Asegúrate de que esto esté configurado correctamente
            direccion: data.direccion,
            imagen: '', // No se establece el valor del campo de archivo
          });
          this.previsualizacion = data.imagen;
          this.urlFoto = data.imagen;

          // Actualiza los departamentos y selecciona el departamento correcto
          this.updateDepartamentos(data.pais);
          this.crearFormulario.get('depto')?.setValue(data.depto);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  updateDepartamentos(pais: string): void {
    const selectedCountry = this.paisesConDepartamentos.find(
      (p) => p.pais === pais
    );
    this.departamentos = selectedCountry ? selectedCountry.departamentos : [];

    // Restablecer el campo de "Departamento" y el valor seleccionado a "Seleccione"
    this.crearFormulario.get('depto')?.setValue('');
    this.crearFormulario.get('depto')?.markAsPristine(); // Opcional: si deseas que se considere sin cambios
  }

  formulario() {
    const id = this.idDestino.source._value;
    if (id == 0) {
      console.log('añadiendo');
      this.addDestino();
    } else {
      console.log('Editando');
      this.editDestino(id);
    }
  }
  addDestino() {
    console.log(this.crearFormulario.value);
    if (this.crearFormulario.invalid) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Complete el formulario' });
    } else {
      // Convertir idDestino e idSalida a enteros
      this.btnEnviar = false;
      this.btnBlock = true;
      this.backend
        .post(`${environment.api}/Destino`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.closeModal();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Destino agregado correctamente',
              });
              this.btnBlock = false;
              this.btnEnviar = true;
              console.log(data);
              this.crearFormulario.reset();
              this.notificaciones.notificarNuevoDestino();
            });
          },
          error: (error) => {
            this.btnBlock = false;
            this.btnEnviar = true;

            if (error.error == 'El destino ya existe') {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Ya existe un destino con este nombre',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'ocurrion un error al crear el destino, intente nuevamente',
              });
            }
          },
        });
    }
  }
  editDestino(id: any) {
    console.log(this.crearFormulario.value);
    // if (this.crearFormulario.value.imagen == '') {
    //   this.crearFormulario.value.imagen = this.urlFoto;
    // }
    this.crearFormulario.value.imagen = this.previsualizacion
    this.backend
      .put(`${environment.api}/Destino/${id}`, this.crearFormulario.value)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.btnBlock = false;
            this.btnEnviar = true;

            this.notificaciones.notificarNuevoDestino();
          });
          this.closeModal();
        },
        error: (error) => {
          this.btnBlock = false;
          this.btnEnviar = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al editar el destino',
          });
        },
      });
  }
  closeModal() {
    this.dialogRef.close(true); // Cierra el modal
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
    this.crearFormulario.controls['imagen'].setValue('');
    this.previsualizacion = '';
    this.archivos = [];
    this.esFotoValida = true;
  }
}
