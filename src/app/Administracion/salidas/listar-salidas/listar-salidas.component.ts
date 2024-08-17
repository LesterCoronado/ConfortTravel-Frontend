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
import { AgregarSalidasComponent } from '../agregar-salidas/agregar-salidas.component';
import { ImageModule } from 'primeng/image';
import { DialogoDeleteComponent } from '../../../dialogs/dialogo-delete/dialogo-delete.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'app-listar-salidas',
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
  templateUrl: './listar-salidas.component.html',
  styleUrl: './listar-salidas.component.css',
})
export class ListarSalidasComponent {
  salidas: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['No', 'Salida', 'Estado', 'Acciones'];
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
    this.notificaciones.nuevaSalida$.subscribe(() => {
      this.getSalidas();
    });
    this.getSalidas();
  }

  getSalidas() {
    this.backend.get(`${environment.api}/Salida`).subscribe({
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
  deleteSalidas(id: any) {
    const dialogRef = this.dialog.open(DialogoDeleteComponent, {
      width: '900px',
      height: '200px',
      data: {
        title: '¿Estás seguro de eliminar?',
        message: 'Ten en cuenta que esta salida será eliminada permanentemente',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.backend.delete(`${environment.api}/Salida/${id}`).subscribe({
          next: (data: any) => {
            this.getSalidas();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Salida eliminada correctamente',
            });
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Error al eliminar la salida, puede que que actualmente se encuentre en uso dentro del sistema',
            });

            console.error(error);
          },
        });
      }
    });
  }
  openAgregarDialog() {
    this.DTO.setIdSalida(0);
    const dialogRef = this.dialog.open(AgregarSalidasComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Salida creada con éxito' });

      }

    }
    );
  }

  openEditarDialog(id:any) {
    this.DTO.setIdSalida(id);
    const dialogRef = this.dialog.open(AgregarSalidasComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Se editó la salida con éxito' });

      }
    }
    );
  }
}
