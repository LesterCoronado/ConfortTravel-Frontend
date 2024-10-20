import { Component } from '@angular/core';
import { NotificacionesService } from '../services/notificaciones.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BackendService } from '../services/backend.service';
import { environment } from '../environments/environments.prod';
import { GalleriaModule } from 'primeng/galleria';
import { PhotoService } from '../services/photo.service';
import { DataService } from '../services/data.service';
@Component({
  selector: 'app-home', 
  standalone: true,
  imports: [ToastModule, ButtonModule, RippleModule, GalleriaModule],
  providers: [MessageService, PhotoService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})


export class HomeComponent {
  images: any[] | undefined;
  excursiones: any[] | undefined;
  traslados: any[] | undefined;
  displayCustom: boolean = false;
    activeIndex: number = 0;
  responsiveOptions: any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];

  constructor(
    private messageService: MessageService,
    private backend: BackendService,
    private photoService: PhotoService,
    private dataService: DataService
  ) {
   
  }

  ngOnInit(): void {
    this.dataService.getData();
    // this.dataService.getData().subscribe(data => {
      
    // });
    this.photoService.getImages().then((images:any) => (this.images = images));
    this.photoService.getExcursiones().then((images:any) => (this.excursiones = images));
    this.photoService.getTraslados().then((images:any) => (this.traslados = images));
    this.backend.get(`${environment.api}/Empleado`).subscribe({
      next: (data: any) => {
        
      },
      error: (error) => {
      },
    });
  }
  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
}
openWhatsApp() {
  window.location.href = 'https://wa.me/48396880/?text=%C2%A1Hola%2C%20quiero%20m%C3%A1s%20informacion%20de%20los%20traslados%21';
}
openWhatsAppExcursiones() {
  window.location.href = 'https://wa.me/48396880/?text=%C2%A1Hola%2C%20quiero%20m%C3%A1s%20informacion%20de%20las%20excursiones%21';
}

getPaquetes() {
  this.backend.get(`${environment.api}/Paquete`).subscribe(
    {
      next: (data: any) => {
        sessionStorage.setItem('paquetes', JSON.stringify(data));
        console.log(data);
      },
      error: (error: any) => {
        console.log(error);
      }
    }
  )
}
}
