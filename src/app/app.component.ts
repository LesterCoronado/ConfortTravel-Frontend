import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarAsideComponent } from "./Administracion/navbar-aside/navbar-aside.component";
import { CookieService } from 'ngx-cookie-service';
import { NotificacionesService } from './services/notificaciones.service';
import { FooterComponent } from './footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NavbarAsideComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pg1_agencia_viajes';
  admin?: boolean;
  constructor(private cookie: CookieService,private notificaciones: NotificacionesService) {}
  ngOnInit(): void {
    let token: any = sessionStorage.getItem('cookie');
    this.notificaciones.nuevoAdmin$.subscribe(() => {
      this.admin = true;
      console.log('Desde la cookie' + this.cookie.get('cookie'));
    });
    if (token == '1') {
      this.admin = true;
    }
  }
}
