import { CanActivate, Router } from '@angular/router';
import { DTOService } from '../services/dto.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class VigilanteGuard implements CanActivate {
  constructor(
    private router: Router,
    private DTO: DTOService,
    private cookie: CookieService

  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let data: any;
   
    let token: any = this.cookie.get('cookie');
    if (token == '2') {
      return true;
    
    
    } else {
      
      // Si no hay token en el sessionStorage, redirige al usuario a la página de inicio de sesión
      this.router.navigate(['/', 'login']);
      return false;
    }
  }
}
