import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NotificacionesService } from '../services/notificaciones.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
   RouterLink
   
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  admin?: boolean;
  login?: boolean;


  constructor(
  
    
    private routerprd: Router,
    private notificaciones: NotificacionesService
  ) {
    
  }

  ngOnInit(): void{
    this.notificaciones.nuevoAdmin$.subscribe(() => {
      this.admin = true;
    });
    this.notificaciones.nuevoLogin$.subscribe(() => {
      this.login = true;
    });
  }

}
