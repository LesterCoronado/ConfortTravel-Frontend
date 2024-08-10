import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../../services/backend.service';
import { Router } from '@angular/router';
import { DatePipe, NgFor } from '@angular/common';
import { DTOService } from '../../../services/dto.service';
import { environment } from '../../../environments/environments.prod';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificacionesService } from '../../../services/notificaciones.service';

@Component({
  selector: 'app-editar-cotizaciones',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor],
  templateUrl: './editar-cotizaciones.component.html',
  styleUrl: './editar-cotizaciones.component.css',
})
export class EditarCotizacionesComponent {
  idCotizacion: any;
  Usuarios: any = [];
  Destinos: any = [];
  Salidas: any = [];
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private notificaciones : NotificacionesService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    public dialogRef: MatDialogRef<EditarCotizacionesComponent>,
  
  ) {
    this.crearFormulario = this.fb.group({
      idUsuario: ['', Validators.required],
      idDestino: ['', Validators.required],
      idSalidaDestino: ['', Validators.required],
      fechaSalida: ['', Validators.required],
      fechaRetorno: ['', Validators.required],
      totalAdultos: ['', Validators.required],
      totalNinos: ['', Validators.required],
      precioCotizacion: ['', Validators.required],
      validoHasta: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.esEditar();
    this.getDestinos();
    this.getUsuarios();
    
    
  }
  esEditar() {
    let data: any;
    data = this.DTO.getIdCotizacion();
    let id = data.source._value;
   
    this.backend.get(`${environment.api}/Cotizacion/${id}`).subscribe({
      next: (data: any) => {
        console.log(data)
        this.idCotizacion = data.idCotizacion;
        this.getSalidas(data.idDestino);
        const datePipe = new DatePipe('en-US');
        const formattedFechaSalida = datePipe.transform(
          data.fechaSalida,
          'yyyy-MM-dd'
        );
        const formattedFechaRetorno = datePipe.transform(
          data.fechaRetorno,
          'yyyy-MM-dd'
        );
        const formattedValidoHasta = datePipe.transform(
          data.validoHasta,
          'yyyy-MM-dd'
        );
        this.crearFormulario.setValue({
          idUsuario: data.idUsuario,
          idDestino: data.idDestino,
          idSalidaDestino: data.idSalidaDestino,
          fechaSalida: formattedFechaSalida,
          fechaRetorno: formattedFechaRetorno,
          totalAdultos: data.totalAdultos,
          totalNinos: data.totalNinos,
          precioCotizacion: data.precioCotizacion,
          validoHasta: formattedValidoHasta,
        });
      },

      error: (err: any) => {},
    });
  }
  listarProductos() {
    this.backend.get(`${environment.api}/Usuarios`).subscribe({
      next: (data: any) => {
        this.Usuarios = data;
      },
    });
  }

  getDestinos() {
    this.backend.get(`${environment.api}/Destino`).subscribe({
      next: (data: any) => {
        this.Destinos = data;
      },
      error: (err) => {
      },
    });
  }
  getUsuarios() {
    this.backend.get(`${environment.api}/Usuarios`).subscribe({
      next: (data: any) => {
        this.Usuarios = data;
      },
      error: (err) => {
      },
    });
  }
  getSalidas(id:any) {
    this.backend.get(`${environment.api}/SalidaDestino/${id}`).subscribe({
      next: (data: any) => {
        this.Salidas = data;
        data.forEach((element:any) => {
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  formulario() {
    console.log(this.crearFormulario.value)
    let data: any;
    data = this.DTO.getUser();
    this.crearFormulario.patchValue({
      idUsuario: data.source._value,
    });

   
      // Convertir idDestino e idSalida a enteros
      const formValue = this.crearFormulario.value;
      formValue.idDestino = parseInt(formValue.idDestino, 10);
      formValue.idSalida = parseInt(formValue.idSalida, 10);
      this.btnEnviar = false;
      this.btnBlock = true;
      this.backend
        .put(`${environment.api}/Cotizacion/${this.idCotizacion}`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.btnBlock = false;
              this.btnEnviar = true;
              alert('Se Editó con Éxito!');
              this.notificaciones.notificarNuevaCotizacion();

            });
            this.closeModal();
          },
          error: (error) => {
            this.btnBlock = false;
            this.btnEnviar = true;
            alert('Uno o mas campos son incorrectos');

            if (error.error == 'usuario no encontrado') {
              alert('Usuario no encontrado');
            } else {
              console.log(
                'Error al tratar de establecer comunicacion con el servidor'
              );
              console.log(error);
            }
          },
        });
    }
  
  closeModal() {
    this.dialogRef.close(); // Cierra el modal
  }
}
