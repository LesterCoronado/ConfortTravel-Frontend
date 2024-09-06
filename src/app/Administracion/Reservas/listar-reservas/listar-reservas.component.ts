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
import { AgregarReservasComponent } from '../agregar-reservas/agregar-reservas.component';
import { ImageModule } from 'primeng/image';
import { DialogoDeleteComponent } from '../../../dialogs/dialogo-delete/dialogo-delete.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { MatInputModule } from '@angular/material/input';
import { AsignarPasajeroComponent } from '../asignar-pasajero/asignar-pasajero.component';
import { DialogModule } from 'primeng/dialog';
import { AsignarHotelComponent } from '../asignar-hotel/asignar-hotel.component';
@Component({
  selector: 'app-listar-reservas',
  standalone: true,
  imports: [
    MatInputModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    RouterLink,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    ImageModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    DialogModule,
  ],
  providers: [MessageService],
  templateUrl: './listar-reservas.component.html',
  styleUrl: './listar-reservas.component.css',
})
export class ListarReservasComponent {
  visible1: boolean = false;
  visible2: boolean = false;
  listaPasajeros: any = [];
  listaHoteles: any = [];
  reservas: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'idReserva',
    'nombrePaqueteViaje',
    'modalidadPaquete',
    'placaVehiculo',
    'fechaSalida',

    'fechaRetorno',

    'totalDias',
    'observaciones',
    'estado',
    'acciones',
    'listaDePasajeros',
    'listaDeHoteles',
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
    this.notificaciones.nuevaReserva$.subscribe(() => {
      this.getReservas();
    });
    this.getReservas();
  }
  


  getReservas() {
    this.backend.get(`${environment.api}/Reserva`).subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
        this.reservas = data;
        console.log(data);
        console.log(this.dataSource.data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  openAgregarDialog() {
    this.DTO.setIdReserva(0);
    const dialogRef = this.dialog.open(AgregarReservasComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Reserva creada con éxito',
        });
      }
    });
  }

  openEditarDialog(id: any) {
    this.DTO.setIdReserva(id);
    const dialogRef = this.dialog.open(AgregarReservasComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Reserva editada con éxito',
        });
      }
    });
  }
  deleteReserva(id: any) {
    const dialogRef = this.dialog.open(DialogoDeleteComponent, {
      width: '900px',
      height: '200px',
      data: {
        title: '¿Estás seguro de eliminar?',
        message: 'Ten en cuenta que la Reserva será eliminada permanentemente',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.backend.delete(`${environment.api}/Reserva/${id}`).subscribe({
          next: (data: any) => {
            this.getReservas();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Reserva eliminada correctamente',
            });
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar la Reserva, intente nuevamente',
            });

            console.error(error);
          },
        });
      }
    });
  }
  openListaPasajeros(id: any) {
    this.backend.get(`${environment.api}/PasajeroReserva/${id}`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.listaPasajeros = data;
        this.visible1 = true;

      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  openListaHoteles(id: any) {
    this.backend.get(`${environment.api}/HotelReserva?id=${id}`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.listaHoteles = data;
        this.visible2 = true;

      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //Funciones de Asignar Reserva:
  openAsignarPasajeroDialog() {
    const dialogRef = this.dialog.open(AsignarPasajeroComponent, {
      width: '510px',
      height: '380px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Éxito',
        });
      }
    });
  }
  openAsignarHotelDialog() {
    const dialogRef = this.dialog.open(AsignarHotelComponent, {
      width: '510px',
      height: '540px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Éxito',
        });
      }
    });
  }
}
