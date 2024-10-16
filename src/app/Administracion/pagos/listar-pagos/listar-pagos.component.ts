import { Component } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { environment } from '../../../environments/environments.prod';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { LucideAngularModule, SquareArrowOutUpRight } from 'lucide-angular';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-listar-pagos',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    LucideAngularModule,
    DialogModule,
  ],
  templateUrl: './listar-pagos.component.html',
  styleUrl: './listar-pagos.component.css',
})
export class ListarPagosComponent {
  downloadLink: SafeResourceUrl | null = null; // Variable para el enlace de descarga del PDF

  visible: boolean = false;
  pagos: any[] = [];
  detallePago: any = {};
  constructor(
    private backend: BackendService,
    private notificaciones: NotificacionesService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.notificaciones.nuevoGenerarPago$.subscribe(() => {
      this.getPagos();
    });
    this.getPagos();
  }

  getPagos() {
    this.backend.get(`${environment.api}/OrdenPago`).subscribe({
      next: (data: any) => {
        this.pagos = data;
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  detallesPago(id: any) {
    this.backend
      .get(`${environment.api}/FEL/GetDetallePago?idOrdenDePago=${id}`)
      .subscribe({
        next: (data: any) => {
          this.createPdfDownloadLink(data.dte); // Convierte y crea el enlace de descarga

          this.detallePago = data;
          console.log(this.detallePago);
          this.showDialog();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  showDialog() {
    this.visible = true;
  }
  // Función para convertir base64 a Blob y crear el enlace de descarga
  private createPdfDownloadLink(base64: string) {
    const byteCharacters = atob(base64); // Decodifica el base64
    const byteNumbers = new Array(byteCharacters.length)
      .fill(null)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Crea un enlace de descarga para el Blob y lo marca como seguro
    const unsafeUrl = URL.createObjectURL(blob);
    this.downloadLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }
}
