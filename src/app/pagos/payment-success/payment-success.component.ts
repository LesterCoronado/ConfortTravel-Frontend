import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { environment } from '../../environments/environments.prod';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css'],
})
export class PaymentSuccessComponent implements OnInit {
  downloadLink: SafeResourceUrl | null = null; // Variable para el enlace de descarga del PDF

  constructor(
    private backend: BackendService,
    private sanitizer: DomSanitizer,
    private cookies: CookieService
  ) {}

  ngOnInit() {
    const nit = sessionStorage.getItem('nit');
    const nombre = sessionStorage.getItem('nombre');
    const idCotizacion = sessionStorage.getItem('idCotizacion');
    const json = {
      nit: nit,
      nombre: nombre,
      idCotizacion: idCotizacion,
    };

    this.backend
      .post(
        `${environment.api}/FEL?nit=${nit}&nombre=${nombre}&idCotizacion=${idCotizacion}`,
        json
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          const dteBase64 = data.responseData3; // Obtiene el DTE en base64
          this.createPdfDownloadLink(dteBase64); // Convierte y crea el enlace de descarga
          this.registrarFelBd(data.serial, data.batch, data.totalAmount, data.responseData3);
        },
        error: (error: any) => {
          console.error('Error al obtener el DTE:', error);
        },
      });
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

  registrarFelBd(noFact: any, serie: any, total: any, dte: any) {
    const nit = parseInt(sessionStorage.getItem('nit') || '0', 10);
    const idOrdenDePago = parseInt(
      sessionStorage.getItem('idOrdenDePago') || '0',
      10
    );
    const idUsuario = parseInt(this.cookies.get('idUser') || '0', 10);
    const numeroFactura = parseInt(noFact, 10);
    const subtotal = parseInt(total, 10);

    let json = {
      idOrdenDePago: idOrdenDePago,
      idUsuario: idUsuario,
      numeroFactura: numeroFactura,
      serie: serie,
      nit: nit,
      subtotal: subtotal,
      dte: dte,
    };
    console.log(json);
    this.backend
      .post(`${environment.api}/FEL/registrar-fel-bd`, json)
      .subscribe({
        next: (data: any) => {
          console.log(data);
        },
        error: (error: any) => {
          console.error('Error al obtener el DTE:', error);
        },
      });
  }
}
