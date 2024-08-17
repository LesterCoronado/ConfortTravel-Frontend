import { Component, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../../services/backend.service';
import { environment } from '../../../environments/environments.prod';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DTOService } from '../../../services/dto.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cotizar',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './cotizar.component.html',
  styleUrl: './cotizar.component.css',
})
export class CotizarComponent {
  idPaquete: any;
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  constructor(private route: ActivatedRoute, private backend: BackendService, public fb: FormBuilder,  private ngZone: NgZone, private DTO: DTOService, private cookie: CookieService) {
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      this.getPaquete(params['id']);
    });

    this.crearFormulario = this.fb.group({
      idUsuario: [0, Validators.required],
      idPaqueteViaje: [0, Validators.required],
      fechaSalida: ['', Validators.required],
      totalAdultos: [0, Validators.required],
      totalNinos: [0, Validators.required],
      comentario: [' ', Validators.required],

    });
  }
  getPaquete(id: any) {
    this.backend.get(`${environment.api}/Paquete/${id}`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.idPaquete = data[0].idPaquete;
        this.crearFormulario.patchValue({['idPaqueteViaje']: this.idPaquete});
        console.log('El id del paquete es: ' + this.idPaquete);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  
  formulario() {
    console.log(this.crearFormulario.value);
    let data: any;
    data = this.DTO.getUser();
    let tokenId: any = this.cookie.get('idUser');
    this.crearFormulario.patchValue({
      idUsuario: tokenId,
    });

    if (this.crearFormulario.invalid) {
      alert('Complete el formulario');
    } else {
      
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
}
