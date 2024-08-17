import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { environment } from '../../environments/environments.prod';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import { TimelineModule } from 'primeng/timeline';

interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}
@Component({
  selector: 'app-info-paquete',
  standalone: true,
  imports: [CommonModule,TimelineModule],
  templateUrl: './info-paquete.component.html',
  styleUrl: './info-paquete.component.css',
})
export class InfoPaqueteComponent {
  paquete: any = [];
  itinerario: any = []; 
  events: EventItem[];
  constructor(private route: ActivatedRoute, private backend: BackendService, private router: Router) {
    this.route.params.subscribe((params) => {
      this.getPaquete(params['id']);
      this.getItinerario(params['id']);
    });
    this.events = [
      { status: 'Abordaje del Avión en Aeropuerto Internacional La Aurora, Ciudad de Guatemala', date: '5:45 am', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
      { status: 'Llegada al Aeropuerto Internacional Mundo Maya, Flores', date: '6:45 am', icon: 'pi pi-cog', color: '#673AB7' },
      { status: `Traslado hacia `, date: '7:45 am', icon: 'pi pi-shopping-cart', color: '#FF9800' },
      { status: `Llegada a e inicio del Tour`, date: '9:15 am', icon: 'pi pi-check', color: '#607D8B' },
      { status: 'Almuerzo en restaurante, a elegir entre 5 opciones', date: '1:30 pm', icon: 'pi pi-check', color: '#607D8B' },
      { status: 'Retorno a Flores', date: '4:30 pm', icon: 'pi pi-check', color: '#607D8B' },
      { status: 'Abordaje del Avión con destino hacia Ciudad de Guatemala', date: '8:30 pm', icon: 'pi pi-check', color: '#607D8B' },
      { status: 'Llegada al Aeropuerto Internacional La Aurora, Ciudad de Guatemala', date: '9:30 pm', icon: 'pi pi-check', color: '#607D8B' },

  ];
  }

  getPaquete(id: any) {
    this.backend.get(`${environment.api}/Paquete/${id}`).subscribe({
      next: (data: any) => {
        this.paquete = data[0];
        console.log(data);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getItinerario(id: any) {
    this.backend.get(`${environment.api}/Itinerario/${id}`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.itinerario = data;
       
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  Cotizar(id: any) {
    this.router.navigate(['/cotizacion', id]);
   }
}
