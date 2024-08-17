import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../services/backend.service';
import { environment } from '../environments/environments.prod';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { DTOService } from '../services/dto.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css',
})
export class ReservasComponent {
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  destinos: any = [];
  salidas: any = [];
  userDTO: any;
  idPaquete: any;

  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.getPaquete(params['id']);
    });
    this.crearFormulario = this.fb.group({
      idUsuario: [0, Validators.required],
      idDestino: [0, Validators.required],
      idSalidaDestino: [0, Validators.required],
      fechaSalida: ['', Validators.required],
      fechaRetorno: ['', Validators.required],
      totalAdultos: [0, Validators.required],
      totalNinos: [0, Validators.required],
    });
  }
  ngOnInit() {
    // this.getDestinos();
    // this.crearFormulario
    //   .get('idDestino')
    //   ?.valueChanges.subscribe((selectedDestinoId) => {
    //     if (selectedDestinoId) {
    //       this.getSalidas(selectedDestinoId);
    //     }
    //   });
  }

  formulario() {
    console.log(this.crearFormulario.value);
    let data: any;
    data = this.DTO.getUser();
    this.crearFormulario.patchValue({
      idUsuario: data.source._value,
    });

    if (this.crearFormulario.invalid) {
      alert('Complete el formulario');
    } else {
      // Convertir idDestino e idSalida a enteros
      const formValue = this.crearFormulario.value;
      formValue.idDestino = parseInt(formValue.idDestino, 10);
      formValue.idSalida = parseInt(formValue.idSalida, 10);
      console.log(this.crearFormulario.value);
      console.log(this.crearFormulario.value);
      this.btnEnviar = false;
      this.btnBlock = true;
      this.backend
        .post(`${environment.api}/Cotizacion`, this.crearFormulario.value)
        .subscribe({
          next: (data: any) => {
            this.ngZone.run(() => {
              this.btnBlock = false;
              this.btnEnviar = true;
              console.log(data);
              this.crearFormulario.reset();
              alert('Cotización creada con éxito');
            });
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
  }

  getDestinos() {
    this.backend.get(`${environment.api}/Destino`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.destinos = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getSalidas(event: any) {
    console.log(event);
    this.backend.get(`${environment.api}/SalidaDestino/${event}`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.salidas = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getPaquete(id: any) {
    this.backend.get(`${environment.api}/Paquete/${id}`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.idPaquete = data[0].idPaquete;
        console.log('El id del paquete es: ' + this.idPaquete);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
