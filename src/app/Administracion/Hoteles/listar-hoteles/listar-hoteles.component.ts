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
import { AgregarHotelesComponent } from '../agregar-hoteles/agregar-hoteles.component';
import { ImageModule } from 'primeng/image';
import { DialogoDeleteComponent } from '../../../dialogs/dialogo-delete/dialogo-delete.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-listar-hoteles',
  standalone: true,
  imports: [
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
  ],
  providers: [MessageService],
  templateUrl: './listar-hoteles.component.html',
  styleUrl: './listar-hoteles.component.css'
})
export class ListarHotelesComponent {
  hoteles: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'ID',
    'Hotel',
    'Telefono',
    'Pais',
    'Depto',
    'Direccion',
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
    this.notificaciones.nuevoHotel$.subscribe(() => {
      this.getHoteles();
    });
    this.getHoteles();
  }

  getHoteles() {
    this.backend.get(`${environment.api}/Hotel`).subscribe({
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
    this.DTO.setIdHotel(0);
    const dialogRef = this.dialog.open(AgregarHotelesComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Hotel creado con éxito' });

      }

    }
    );
  }

  openEditarDialog(id:any) {
    this.DTO.setIdHotel(id);
    const dialogRef = this.dialog.open(AgregarHotelesComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Se editó el Hotel con éxito' });

      }
    }
    );
  }
  deleteHotel(id: any) {
    const dialogRef = this.dialog.open(DialogoDeleteComponent, {
      width: '900px',
      height: '200px',
      data: {
        title: '¿Estás seguro de eliminar?',
        message: 'Ten en cuenta que este Hotel será eliminado permanentemente',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.backend.delete(`${environment.api}/Hotel/${id}`).subscribe({
          next: (data: any) => {
            this.getHoteles();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Hotel eliminado correctamente',
            });
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Error al eliminar el Hotel, puede que que actualmente se encuentre en uso dentro del sistema',
            });

            console.error(error);
          },
        });
      }
    });
  }
}
