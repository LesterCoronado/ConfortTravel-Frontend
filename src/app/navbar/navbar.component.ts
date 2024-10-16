import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NotificacionesService } from '../services/notificaciones.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  userId: any;
  client?: boolean;
  admin?: boolean;
  login?: boolean;

  constructor(
    private routerprd: Router,
    private notificaciones: NotificacionesService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    
    let token: any = this.cookie.get('cookie');
    this.userId = this.cookie.get('idUser');
    if (token == '1') {
      this.admin = true;
    }
    if (token == '2') {
      this.client = true;
    }
    if (token) {
      this.login = true;
    }
    console.log();

    this.notificaciones.nuevoCliente$.subscribe(() => {
      this.client = true;
      this.userId = this.cookie.get('idUser');

    });

    this.notificaciones.nuevoAdmin$.subscribe(() => {
      this.admin = true;
      console.log('Desde la cookie' + this.cookie.get('cookie'));
    });
    this.notificaciones.nuevoLogin$.subscribe(() => {
      this.login = true;
    });
  }
  logOut() {
    this.client = false;
    this.admin = false;
    this.cookie.deleteAll();

    this.routerprd.navigate(['/', 'login']);
  }
}
