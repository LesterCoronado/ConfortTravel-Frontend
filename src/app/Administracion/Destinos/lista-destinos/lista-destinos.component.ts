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
import { AgregarDestinosComponent } from '../agregar-destinos/agregar-destinos.component';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { ImageModule } from 'primeng/image';
import { DialogoDeleteComponent } from '../../../dialogs/dialogo-delete/dialogo-delete.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'app-lista-destinos',
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
    RippleModule
  ],
  providers: [MessageService],
  templateUrl: './lista-destinos.component.html',
  styleUrl: './lista-destinos.component.css'
})
export class ListaDestinosComponent {
  destinos: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
 
    'Destino',
    'Imagen',
    'Pais',
    'Departamento',
    'Direccion',
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
    this.notificaciones.nuevoDestino$.subscribe(() => {
      this.getDestinos();
    });
    this.getDestinos();
  }

  getDestinos() {
    this.backend.get(`${environment.api}/Destino`).subscribe(
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

  deleteDestinos(id: any) {
    const dialogRef = this.dialog.open(DialogoDeleteComponent, {
      width: '900px',
      height: '200px',
      data: {
        title: '¿Estás seguro de eliminar?',
        message: 'Ten en cuenta que este destino será eliminado permanentemente',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.backend.delete(`${environment.api}/Destino/${id}`).subscribe(
          {
            next: (data : any) => {
              this.getDestinos();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Destino eliminado correctamente' });
            
            },
            error: (error) => {
              console.log(error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el destino, puede que que actualmente se encuentre en uso dentro del sistema' });

           
              console.error(error);
          }
        }
        )
      }
    });

   
  }

  openAgregarDialog() {
    this.DTO.setIdDestino(0);
    const dialogRef = this.dialog.open(AgregarDestinosComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Destino creado con éxito' });

      }

    }
    );
  }

  openEditarDialog(id:any) {
    this.DTO.setIdDestino(id);
    const dialogRef = this.dialog.open(AgregarDestinosComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Se editó el destino con éxito' });

      }
    }
    );
  }

}
