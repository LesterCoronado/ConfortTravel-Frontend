import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RegistroUsuariosComponent } from './registro-usuarios/registro-usuarios.component';
import { ReservasComponent } from './cotiza/reservas.component';
import { AgregarCotizacionesComponent } from './Administracion/cotizaciones/agregar-cotizaciones/agregar-cotizaciones.component';
import { ListarCotizacionesComponent } from './Administracion/cotizaciones/listar-cotizaciones/listar-cotizaciones.component';
import { VigilanteGuard } from './guards/vigilante.guard';
import { AdminGuard } from './guards/admin.guard';
import { ListaDestinosComponent } from './Administracion/Destinos/lista-destinos/lista-destinos.component';
import { ListarSalidasComponent } from './Administracion/salidas/listar-salidas/listar-salidas.component';
import { ListaPaquetesComponent } from './paquetes/lista-paquetes/lista-paquetes.component';
import { InfoPaqueteComponent } from './paquetes/info-paquete/info-paquete.component';
import { CotizarComponent } from './cotiza/cotizaciones/cotizar/cotizar.component';
import { ListarPaquetesComponent } from './Administracion/paquetes/listar-paquetes/listar-paquetes.component';
import { ListarItinerarioComponent } from './Administracion/paquetes/itinerario/listar-itinerario/listar-itinerario.component';
import { ListarIncluyeComponent } from './Administracion/paquetes/incluye/listar-incluye/listar-incluye.component';
import { ListarNoIncluyeComponent } from './Administracion/paquetes/noIncluye/listar-no-incluye/listar-no-incluye.component';

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
        path: 'listar-cotizacion', component: ListarCotizacionesComponent,
        canActivate:  [AdminGuard] 
    },
    {
        path: 'listar-destinos', component: ListaDestinosComponent,
        canActivate:  [AdminGuard] 
    },
    {
        path: 'listar-salidas', component: ListarSalidasComponent,
        canActivate:  [AdminGuard] 
    },
    {
        path: 'paquetes', component: ListaPaquetesComponent
       
    },
    {
        path: 'paquete/:id', component: InfoPaqueteComponent
       
    },
    {
        path: 'itinerario/:id', component: ListarItinerarioComponent
       
    },
    {
        path: 'incluye/:id', component: ListarIncluyeComponent
       
    },
    {
        path: 'no-incluye/:id', component: ListarNoIncluyeComponent
       
    },

    {
        path: 'cotizacion/:id', component: CotizarComponent
       
    },

    {
        path: 'listar-paquetes', component: ListarPaquetesComponent
       
    },



    { 
        path: '', redirectTo: '/inicio', pathMatch: 'full' 
    },

];
