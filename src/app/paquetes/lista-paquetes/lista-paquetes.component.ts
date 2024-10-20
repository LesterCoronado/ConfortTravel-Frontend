import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { environment } from '../../environments/environments.prod';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-lista-paquetes',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './lista-paquetes.component.html',
  styleUrl: './lista-paquetes.component.css'
})

export class ListaPaquetesComponent {
  loading = true;
  paquetes: any = [];
  constructor(private backend: BackendService, private router: Router, private dataService: DataService) {
   
  }
  ngOnInit(): void {
    this.loadPaquetes();
  }
  private async loadPaquetes(): Promise<void> {
    this.paquetes = await this.dataService.getData();
    this.loading = false; // Desactiva el indicador de carga cuando los datos están listos
  }

  getPaquetes() {
    this.backend.get(`${environment.api}/Paquete`).subscribe(
      {
        next: (data: any) => {
          this.paquetes = data;
          console.log(data);
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }
  verMas(id: any) {
   this.router.navigate(['/paquete', id]);
  }
  Cotizar(id: any) {
    this.router.navigate(['/cotizacion', id]);
   }

}
