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
  selector: 'app-agregar-hoteles',
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
  templateUrl: './agregar-hoteles.component.html',
  styleUrl: './agregar-hoteles.component.css'
})
export class AgregarHotelesComponent {
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  tituloModal: string = 'AGREGAR HOTEL';
  idHotel: any;

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
  ]; //estado del Hotel

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
    public dialogRef: MatDialogRef<AgregarHotelesComponent>,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {
    this.crearFormulario = this.fb.group({
      idHotel: [0, Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      pais: ['', Validators.required],
      depto: ['', Validators.required],
      direccion: ['', Validators.required],
      estado: [true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.idHotel = this.DTO.getIdHotel();

    this.esEditar();
    this.crearFormulario.get('pais')?.valueChanges.subscribe((pais) => {
      this.updateDepartamentos(pais);
    });
  }
  esEditar() {
    const id = this.idHotel.source._value;
    if (id !== 0) {
      this.tituloModal = 'EDITAR HOTEL';
      this.backend.get(`${environment.api}/Hotel/${id}`).subscribe({
        next: (data: any) => {
          this.crearFormulario.setValue({
            idHotel: data.idHotel,
            nombre: data.nombre,
            telefono: data.telefono,
            pais: data.pais,
            depto: data.depto,
            direccion: data.direccion,
            estado: data.estado,
          });
          

          // Actualizar los departamentos y selecciona el departamento correcto
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
    const id = this.idHotel.source._value;
    if (id == 0) {
      console.log('añadiendo');
      this.addHotel();
    } else {
      console.log('Editando');
      this.editHotel(id);
    }
  }

  addHotel() {
    console.log(this.crearFormulario.value);
    if (this.crearFormulario.invalid) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Complete el formulario' });
    } else {
      this.btnEnviar = false;
      this.btnBlock = true;
      this.backend
        .post(`${environment.api}/Hotel`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.closeModal();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Hotel agregado correctamente',
              });
              this.btnBlock = false;
              this.btnEnviar = true;
              console.log(data);
              this.crearFormulario.reset();
              this.notificaciones.notificarNuevoHotel();
            });
          },
          error: (error) => {
            this.btnBlock = false;
            this.btnEnviar = true;

            if (error.error == 'Hotel repetido') {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Ya existe un Hotel con este nombre',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'ocurrion un error al crear el Hotel, intente nuevamente',
              });
            }
          },
        });
    }
  }
  editHotel(id: any) {
    console.log(this.crearFormulario.value);
    this.backend
      .put(`${environment.api}/Hotel/${id}`, this.crearFormulario.value)
      .subscribe({
        next: (data: any) => {
          this.ngZone.run(() => {
            this.btnBlock = false;
            this.btnEnviar = true;

            this.notificaciones.notificarNuevoHotel();
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


}
