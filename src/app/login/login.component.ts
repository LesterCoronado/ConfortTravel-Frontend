import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../services/backend.service';
import { environment } from '../environments/environments.prod';
import { Router } from '@angular/router';
import { DTOService } from '../services/dto.service';
import { NotificacionesService } from '../services/notificaciones.service';
import { CookieService } from 'ngx-cookie-service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    RippleModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  crearFormulario: FormGroup;

  constructor(
    public fb: FormBuilder,
    private backend: BackendService,
    private routerprd: Router,
    private ngZone: NgZone,
    private DTO: DTOService,
    private notificaciones: NotificacionesService,
    private cookie: CookieService,
    private messageService: MessageService
  ) {
    this.crearFormulario = this.fb.group({
      correo: ['', Validators.required],
      contraseña: ['', Validators.required],
    });
  }

  ngOnInit() {}
  redirigir(): void {
    this.routerprd.navigate(['/registro-usuarios']);
  }

  formulario() {
    if (this.crearFormulario.invalid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Complete el formulario',
      });
    } else {
      this.btnEnviar = false;
      this.btnBlock = true;
      this.backend
        .get(
          `${environment.api}/Login?email=${this.crearFormulario.value.correo}&password=${this.crearFormulario.value.contraseña}`
        )
        .subscribe({
          next: (data: any) => {
            sessionStorage.setItem('email', data.correo);
            this.SendUserDTO(data.idUsuario);
            this.notificaciones.notificarNuevoLogin();
            sessionStorage.setItem('cookie', data.idRol);
            // this.cookie.set('cookie', data.idRol);
            // this.cookie.set('idUser', data.idUsuario);
            sessionStorage.setItem('cookie', data.idRol);
            sessionStorage.setItem('idUser', data.idUsuario);

            console.log(data.rol);
            if (data.rol == 'Administrador') {
              this.notificaciones.notificarNuevoAdmin();
              console.log('si es admin');
            }
            if (data.rol == 'Cliente') {
              this.notificaciones.notificarNuevoCliente();
              console.log('si es admin');
            }

            this.btnBlock = false;

            this.ngZone.run(() => {
              this.btnEnviar = true;
              this.routerprd.navigate(['/inicio']);
            });
          },
          error: (error) => {
            console.log(error);
            this.btnBlock = false;
            this.btnEnviar = true;

            if (error.error == 'Usuario no encontrado') {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Correo o contraseña incorrectos',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  'Error al tratar de establecer comunicacion con el servidor',
              });
            }
          },
        });
    }
  }

  SendUserDTO(user: any) {
    this.DTO.setUser(user);

    let data: any;
    data = this.DTO.getUser();
    console.log(this.DTO.getUser());
  }
}
