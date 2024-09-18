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
import { DialogModule } from 'primeng/dialog';
import { AgregarPlanillaComponent } from '../agregar-planilla/agregar-planilla.component';

@Component({
  selector: 'app-listar-planilla',
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
  templateUrl: './listar-planilla.component.html',
  styleUrl: './listar-planilla.component.css'
})
export class ListarPlanillaComponent {
  listaPlanilla: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'empleado',
    'cargo',
    'deptoTrabajo',
    'fechaContratacion',
    'tipoContrato',
    'tiempoContrato',
    'fechaDeBaja',
    'salarioBase',
    'noCuenta',
    'estado',
    'acciones'
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
    this.notificaciones.nuevaPlanilla$.subscribe(() => {
      this.getPlanilla();
    });
    this.getPlanilla();
  }

  getPlanilla() {
    this.backend.get(`${environment.api}/Planilla`).subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
        this.listaPlanilla = data;
        console.log(data);
        console.log(this.dataSource.data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  openAgregarDialog() {
    this.DTO.setIdPlanilla(0);
    const dialogRef = this.dialog.open(AgregarPlanillaComponent, {
      width: '100%', // Ajuste al 100% del ancho del viewport
    maxWidth: '560px',
     
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Planilla creada con éxito',
        });
      }
    });
  }

  openEditarDialog(id: any) {
    this.DTO.setIdPlanilla(id);
    const dialogRef = this.dialog.open(AgregarPlanillaComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Planilla editada con éxito',
        });
        this.getPlanilla();
      }
    });
  }
  deletePlanilla(id: any) {
    const dialogRef = this.dialog.open(DialogoDeleteComponent, {
      width: '900px',
      height: '200px',
      data: {
        title: '¿Estás seguro de eliminar?',
        message: 'Ten en cuenta que la planilla será eliminada permanentemente',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.backend.delete(`${environment.api}/Planilla/${id}`).subscribe({
          next: (data: any) => {
            this.getPlanilla();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Planilla eliminada correctamente',
            });
          },
          error: (error) => {
            
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar, intente nuevamente',
            });

            console.error(error);
          },
        });
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
