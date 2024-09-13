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
import { ImageModule } from 'primeng/image';
import { DialogoDeleteComponent } from '../../../dialogs/dialogo-delete/dialogo-delete.component';
import { MessageService } from 'primeng/api';
import { EditarPaqueteComponent } from '../editar-paquete/editar-paquete.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-listar-paquetes',
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
    RouterLink,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    TagModule,
  ],
  providers: [MessageService, RippleModule],
  templateUrl: './listar-paquetes.component.html',
  styleUrl: './listar-paquetes.component.css',
})
export class ListarPaquetesComponent {
  paquetes: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'Titulo',
    'Portada',
    'Descripcion',
    'ModalidadPaquete',
    'Salida',
    'TotalDias',
    'TotalNoches',
    'MinPax',
    'MaxPax',
    'PoliticaCancelacion',
    'Acciones',
    'Estado',
   
    // 'Itinerario',
    // 'Incluye',
    // 'NoIncluye',
  ];
  dataSource = new MatTableDataSource();
  constructor(
    private backend: BackendService,
    private DTO: DTOService,
    public dialog: MatDialog,
    private notificaciones: NotificacionesService,
    private messageService: MessageService,
    private router: Router,
    private cookie: CookieService,
  ) {}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // Llamamos a toggleDragOverClass en AfterViewInit para asegurarnos de que Angular haya inicializado las vistas.
  }
  ngOnInit(): void {
    this.notificaciones.nuevoPaquete$.subscribe(() => {
      this.getPaquetes();
    });
    this.getPaquetes();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPaquetes() {
    this.backend.get(`${environment.api}/Paquete/admin`).subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
        this.paquetes = data;
        console.log(data);
        console.log(this.dataSource.data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  deletePaquete(id: any) {
    const dialogRef = this.dialog.open(DialogoDeleteComponent, {
      width: '900px',
      height: '200px',
      data: {
        title: '¿Estás seguro de eliminar?',
        message:
          'Ten en cuenta que este paquete será eliminado permanentemente',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.backend.delete(`${environment.api}/Paquete/${id}`).subscribe({
          next: (data: any) => {
            this.getPaquetes();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Paquete eliminado correctamente',
            });
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Error al eliminar paquete, puede que que actualmente se encuentre en uso dentro del sistema',
            });

            console.error(error);
          },
        });
      }
    });
  }
  openAgregarDialog() {
    this.DTO.setIdPaquete(0);
    const dialogRef = this.dialog.open(EditarPaqueteComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Paquete creado con éxito',
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear paquete, intente nuevamente',
        });
      }
    });
  }

  openEditarDialog(id: any) {
    this.DTO.setIdPaquete(id);
    const dialogRef = this.dialog.open(EditarPaqueteComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Se editó el paquete con éxito',
        });
      }
    });
  }
  openItinerario(id: any) {
    this.DTO.setIdItinerario(id);
    this.cookie.set('idPaquete', id);
    this.router.navigate(['/itinerario', id]);
  }
  openIncluye(id: any) {
    this.DTO.setIdItinerario(id);
    this.cookie.set('idPaquete', id);
    this.router.navigate(['/incluye', id]);
  }
  openNoIncluye(id: any) {
    this.DTO.setIdItinerario(id);
    this.cookie.set('idPaquete', id);
    this.router.navigate(['/no-incluye', id]);
  }
}
