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
@Component({
  selector: 'app-listar-cotizaciones',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, 
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
   
  

  ],
  templateUrl: './listar-cotizaciones.component.html',
  styleUrl: './listar-cotizaciones.component.css'
})
export class ListarCotizacionesComponent {
  cotizaciones: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'Cliente',
    'Destino',
    'LugarSalida',
    'FechaSalida',
    'FechaRetorno',
    'TotalDias',
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
    private notificaciones: NotificacionesService
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

  getCotizaciones(){
    this.backend.get(`${environment.api}/Cotizacion`).subscribe(
      {
        next: (data : any) => {
          this.dataSource.data = data;
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
  }

}
