import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BackendService } from '../../../services/backend.service';
import { environment } from '../../../environments/environments.prod';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DTOService } from '../../../services/dto.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { AgregarVehiculosComponent } from '../agregar-vehiculos/agregar-vehiculos.component';
import { ImageModule } from 'primeng/image';
import { DialogoDeleteComponent } from '../../../dialogs/dialogo-delete/dialogo-delete.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'app-listar-vehiculos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    ImageModule,
    ToastModule,
    ButtonModule,
    RippleModule,
  ],
  providers: [MessageService],
  templateUrl: './listar-vehiculos.component.html',
  styleUrl: './listar-vehiculos.component.css',
})
export class ListarVehiculosComponent {
  vehiculos: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'ID',
    'Marca',
    'Modelo',
    'Placa',
    'Color',
    'Capacidad',
    'Estado',
    'Acciones',
  ];
  dataSource = new MatTableDataSource();
  constructor(
    private backend: BackendService,
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
    this.notificaciones.nuevoVehiculo$.subscribe(() => {
      this.getVehiculos();
    });
    this.getVehiculos();
  }

  getVehiculos() {
    this.backend.get(`${environment.api}/Vehiculo`).subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
        console.log(data);
        console.log(this.dataSource.data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  openAgregarDialog() {
    this.DTO.setIdVehiculo(0);
    const dialogRef = this.dialog.open(AgregarVehiculosComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vehículo creado con éxito' });

      }

    }
    );
  }

  openEditarDialog(id:any) {
    this.DTO.setIdVehiculo(id);
    const dialogRef = this.dialog.open(AgregarVehiculosComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Se editó el vehículo con éxito' });

      }
    }
    );
  }
  deleteVehiculo(id: any) {
    const dialogRef = this.dialog.open(DialogoDeleteComponent, {
      width: '900px',
      height: '200px',
      data: {
        title: '¿Estás seguro de eliminar?',
        message: 'Ten en cuenta que este vehículo será eliminado permanentemente',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.backend.delete(`${environment.api}/Vehiculo/${id}`).subscribe({
          next: (data: any) => {
            this.getVehiculos();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'vehículo eliminado correctamente',
            });
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Error al eliminar el vehículo, puede que que actualmente se encuentre en uso dentro del sistema',
            });

            console.error(error);
          },
        });
      }
    });
  }
}
