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
  paquetes: any = [];
  constructor(private backend: BackendService, private router: Router, private dataService: DataService) {
   
  }
  ngOnInit(): void {
    this.loadPaquetes();
  }
  private loadPaquetes(): void {
    this.dataService.getData().subscribe(data => {
      this.paquetes = data;
    });
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
