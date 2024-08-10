import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RegistroUsuariosComponent } from './registro-usuarios/registro-usuarios.component';
import { ReservasComponent } from './cotizaciones/reservas.component';
import { AgregarCotizacionesComponent } from './Administracion/cotizaciones/agregar-cotizaciones/agregar-cotizaciones.component';
import { ListarCotizacionesComponent } from './Administracion/cotizaciones/listar-cotizaciones/listar-cotizaciones.component';
import { VigilanteGuard } from './guards/vigilante.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'navbar', component: NavbarComponent
    },
    {
        path: 'inicio', component: HomeComponent
    },
    {
        path: 'registro-usuarios', component: RegistroUsuariosComponent
    },
    {
        path: 'cotizacion', component: ReservasComponent,
        canActivate:  [VigilanteGuard] 
    },

    {
        path: 'listar-cotizacion', component: ListarCotizacionesComponent,
        canActivate:  [AdminGuard] 
    },



    { 
        path: '', redirectTo: '/inicio', pathMatch: 'full' 
    },

];
