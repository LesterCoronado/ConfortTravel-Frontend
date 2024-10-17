import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BackendService } from '../../../services/backend.service';
import { environment } from '../../../environments/environments.prod';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { DTOService } from '../../../services/dto.service';
import { MatDialog } from '@angular/material/dialog';
import { EditarCotizacionesComponent } from '../editar-cotizaciones/editar-cotizaciones.component';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms'; 
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-listar-cotizaciones',
  standalone: true,
  imports: [
    FormsModule,
    CalendarModule ,
    TooltipModule,
    CommonModule,
    MatTableModule, 
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    TagModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    DialogModule

  ],
  providers: [MessageService],
  templateUrl: './listar-cotizaciones.component.html',
  styleUrl: './listar-cotizaciones.component.css'
})
export class ListarCotizacionesComponent {
  btnEnviar: boolean = true;
  fechaLimitePago: Date | undefined;
  IdCotizacion: any;
  visible: boolean = false;
  cotizaciones: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'Id',
    'Cliente',
    'Destino',
    'Modalidad',
    'LugarSalida',
    'FechaSalida',
    'Comentario',
    'Adultos',
    'Ninos',
    'PrecioCotizacion',
    'ValidoHasta',
    'Estado',
    'Acciones',
  ];
  dataSource = new MatTableDataSource();

  constructor(
    private backend : BackendService,
    private DTO: DTOService,
    public dialog: MatDialog,
    private notificaciones: NotificacionesService,
    private messageService: MessageService
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // Llamamos a toggleDragOverClass en AfterViewInit para asegurarnos de que Angular haya inicializado las vistas.
  }
  ngOnInit(): void {
    this.notificaciones.nuevaCotizacion$.subscribe(() => {
      this.getCotizaciones();
    });
    this.getCotizaciones(); 

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getCotizaciones(){
    this.backend.get(`${environment.api}/Cotizacion`).subscribe(
      {
        next: (data : any) => {
          this.dataSource.data = data;
          this.cotizaciones = data;
          console.log(data);
          console.log( this.dataSource.data);
        },
        error: (error) => {
          console.error(error);
      }
    }
    )
      
  }

  openDialog(id: any) {
    this.DTO.setIdCotizacion(id);
    console.log("guardando.." + id);

    const dialogRef = this.dialog.open(EditarCotizacionesComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cotizacion editada con éxito',
        });
      }
      else{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al editar cotizacion',
        });
      }
    });
  }

  showDialog(id: any) {
    this.visible = true;
    this.IdCotizacion = id;
}

  generarOrdenPago(){
    this.btnEnviar = false;

    let cotizacion: any= {};
    this.backend.get(`${environment.api}/Cotizacion/${this.IdCotizacion}`).subscribe(
      {
        next: (data : any) => {
          cotizacion = data;
          console.log(cotizacion);
          let numero = data[0].precioCotizacion.toFixed(2);
          let stringNumero = numero.toString();

           // Crear los headers
    const headers = new HttpHeaders({
      'X-PUBLIC-KEY': environment.X_PUBLIC_KEY,
      'X-SECRET-KEY': environment.X_SECRET_KEY
    });

    // Realizar la petición POST
    this.backend.postPago(
      `https://app.recurrente.com/api/products`,
      {
        product: {
          name: cotizacion[0].paqueteViaje, 
          description: cotizacion[0].paqueteViaje,
          custom_payment_method_settings: 'true',
          adjustable_quantity: 'false',
          card_payments_enabled: 'true',
          bank_transfer_payments_enabled: 'true',
          available_installments: [],
          success_url: 'https://conforttravelgt.com/payment-success', 
          prices_attributes: [
            {
              amount_as_decimal: stringNumero,
              currency: 'GTQ',
              charge_type: 'one_time',
            },
          ],
        },  
      },
      {
        headers: headers,
      }
    ).subscribe({
      next: (data: any) => {
        this.crearCheckOut(data.id);
      },
      error: (error) => {
        console.log(error);
      },
    });
  
        },
        error: (error) => {
          console.error(error);
      }
    }
    )
   
  }
  crearCheckOut(id: any) {
    const headers = new HttpHeaders({
      'X-PUBLIC-KEY': environment.X_PUBLIC_KEY,
      'X-SECRET-KEY': environment.X_SECRET_KEY
    });
    this.backend.postPago(
      `https://app.recurrente.com/api/checkouts`,
      {
        items: [{ price_id: id }],
      },
      {
        headers: headers,
      }
    ).subscribe({
      next: (data: any) => {
        
        this.asignarPago(data.checkout_url, data.id);
      },
      error: (error) => {
        this.btnEnviar = false;
      },
    });
  }

    

  
asignarPago(checkout: any, id: any) {
  
  let json ={
    "idCotizacion": this.IdCotizacion,
    "fechaVencimiento": this.fechaLimitePago,
    "checkout": checkout
  }
  console.log(json)
  this.backend.post(`${environment.api}/OrdenPago`, json).subscribe(
    {
      next: (data : any) => {
        this.btnEnviar = true;
        this.visible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Orden de pago generada con éxito',
        });
        this.notificaciones.notificarGenerarPago();
      },
      error: (error) => {
        this.btnEnviar = true;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al generar orden de pago',
        });
        console.error(error);
    }
  }
  )
}
}
