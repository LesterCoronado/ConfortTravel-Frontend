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
import { ListarReservasComponent } from './Administracion/Reservas/listar-reservas/listar-reservas.component';
import { ListarVehiculosComponent } from './Administracion/vehiculos/listar-vehiculos/listar-vehiculos.component';
import { ListarHotelesComponent } from './Administracion/Hoteles/listar-hoteles/listar-hoteles.component';
import { CrearPasajeroComponent } from './Administracion/Reservas/crear-pasajero/crear-pasajero.component';
import { ListarEmpleadosComponent } from './Administracion/empleados/listar-empleados/listar-empleados.component';
import { ListarPlanillaComponent } from './Administracion/planilla/listar-planilla/listar-planilla.component';
import { ListarPagosComponent } from './Administracion/pagos/listar-pagos/listar-pagos.component';
import { PagosPendientesComponent } from './pagos/pagos-pendientes/pagos-pendientes.component';
import { HistorialPagosComponent } from './pagos/historial-pagos/historial-pagos.component';
import { PaymentSuccessComponent } from './pagos/payment-success/payment-success.component';

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
        path: 'cotizacion/:id', component: CotizarComponent,
        canActivate:  [VigilanteGuard]
       
    },

    {
        path: 'listar-paquetes', component: ListarPaquetesComponent
       
    },
    {
        path: 'reservas', component: ListarReservasComponent
       
    },
    {
        path: 'vehiculos', component: ListarVehiculosComponent
       
    },
    {
        path: 'hoteles', component: ListarHotelesComponent
       
    },
    {
        path: 'crear-pasajero', component: CrearPasajeroComponent
       
    },
    {
        path: 'empleados', component: ListarEmpleadosComponent
       
    },
    {
        path: 'planilla', component: ListarPlanillaComponent
       
    },
    //lista de pagos de cotizaciones para el area de administracion
    {
        path: 'pagos', component: ListarPagosComponent
       
    },
    //lista de mis pagos pendientes para el area de usuario
    {
        path: 'pagos-pendientes/:id', component: PagosPendientesComponent,
        canActivate:  [VigilanteGuard]
       
    },
    //historial de pagos para el area de usuario
    {
        path: 'historial-pagos:/id', component: HistorialPagosComponent
       
    },

    { 
        path: '', redirectTo: '/inicio', pathMatch: 'full' 
    },

    {
        path: 'payment-success', component: PaymentSuccessComponent
       
    },

];
