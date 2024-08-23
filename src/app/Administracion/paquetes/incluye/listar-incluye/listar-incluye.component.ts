import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BackendService } from '../../../../services/backend.service';
import { environment } from '../../../../environments/environments.prod';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DTOService } from '../../../../services/dto.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionesService } from '../../../../services/notificaciones.service';
import { ImageModule } from 'primeng/image';
import { DialogoDeleteComponent } from '../../../../dialogs/dialogo-delete/dialogo-delete.component';
import { MessageService } from 'primeng/api';
import { EditarPaqueteComponent } from '../../editar-paquete/editar-paquete.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ActivatedRoute, Router } from '@angular/router';
import { AgregarIncluyeComponent } from '../agregar-incluye/agregar-incluye.component';

@Component({
  selector: 'app-listar-incluye',
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
  ],
  providers: [MessageService, RippleModule],
  templateUrl: './listar-incluye.component.html',
  styleUrl: './listar-incluye.component.css'
})
export class ListarIncluyeComponent {
  lista_incluye: any = [];
  idIncluye: any;
  idIPaquete: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'ID',
    'Incluye',
    'Estado',
    'Acciones'
  ];
  dataSource = new MatTableDataSource();
  constructor(
    private backend: BackendService,
    private DTO: DTOService,
    public dialog: MatDialog,
    private notificaciones: NotificacionesService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.getIncluye(params['id']);
      this.idIncluye = params['id'];
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // Llamamos a toggleDragOverClass en AfterViewInit para asegurarnos de que Angular haya inicializado las vistas.
  }
  ngOnInit(): void {
    this.notificaciones.nuevoIncluye$.subscribe(() => {
      this.getIncluye(this.idIncluye);
    });
  }

  getIncluye(id: any) {
    this.backend.get(`${environment.api}/PaqueteIncluye/${id}`).subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  deleteIncluye(id: any) {
    const dialogRef = this.dialog.open(DialogoDeleteComponent, {
      width: '900px',
      height: '200px',
      data: {
        title: '¿Estás seguro de eliminar?',
        message:
          'Ten en cuenta que esta actividad será eliminada permanentemente',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.backend.delete(`${environment.api}/PaqueteIncluye/${id}`).subscribe({
          next: (data: any) => {
            this.getIncluye(this.idIncluye);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Actividad elimina con éxito',
            });
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Error al eliminar actividad del itineraio, intente nuevamente',
            });

            console.error(error);
          },
        });
      }
    });
  }
  openAgregarDialog(id: any) {
    this.DTO.setIdIncluye(0);
    const dialogRef = this.dialog.open(AgregarIncluyeComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Actividad creada con éxito',
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error al crear actividad, intente nuevamente',
        });
      }
    });
  }

  openEditarDialog(id: any) {
    this.DTO.setIdIncluye(id);
    const dialogRef = this.dialog.open(AgregarIncluyeComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Se editó con éxito',
        });
      }
      else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error al editar, intente nuevamente',
        });
      }
    });
  }

}
