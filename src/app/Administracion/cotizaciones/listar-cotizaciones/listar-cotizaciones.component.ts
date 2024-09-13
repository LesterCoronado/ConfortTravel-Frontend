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

@Component({
  selector: 'app-listar-cotizaciones',
  standalone: true,
  imports: [
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

  ],
  providers: [MessageService],
  templateUrl: './listar-cotizaciones.component.html',
  styleUrl: './listar-cotizaciones.component.css'
})
export class ListarCotizacionesComponent {
  cotizaciones: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
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

}
