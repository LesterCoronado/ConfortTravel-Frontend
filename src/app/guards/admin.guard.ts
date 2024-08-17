import { CanActivate, Router } from '@angular/router';
import { DTOService } from '../services/dto.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NotificacionesService } from '../services/notificaciones.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  login?: boolean;
  constructor(
    private router: Router,
    private DTO: DTOService,
    private notificaciones : NotificacionesService,
    private cookie: CookieService

  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let cookie = sessionStorage.getItem('cookie')

    let token: any = this.cookie.get('cookie');
    if (token == '1') {
      return true;
    
    
    } else {
      
      // Si no hay token en el sessionStorage, redirige al usuario a la página de inicio de sesión
      this.router.navigate(['/', 'login']);
      return false;
    }
  }
}
