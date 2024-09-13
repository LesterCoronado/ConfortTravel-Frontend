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
import { AgregarEmpleadoComponent } from '../agregar-empleado/agregar-empleado.component';

@Component({
  selector: 'app-listar-empleados',
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
  templateUrl: './listar-empleados.component.html',
  styleUrl: './listar-empleados.component.css'
})
export class ListarEmpleadosComponent {
  listaEmpleados: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'nombre',
    'fechaNac',
    'dpi',
    'telefono',
    'correo',
    'sexo',
    'formacionAcademica',
    'direccion',
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
    this.notificaciones.nuevoEmpleado$.subscribe(() => {
      this.getEmpleados();
    });
    this.getEmpleados();
  }

  getEmpleados() {
    this.backend.get(`${environment.api}/Empleado`).subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
        this.listaEmpleados = data;
        console.log(data);
        console.log(this.dataSource.data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  openAgregarDialog() {
    this.DTO.setIdEmpleado(0);
    const dialogRef = this.dialog.open(AgregarEmpleadoComponent, {
      width: '100%', // Ajuste al 100% del ancho del viewport
    maxWidth: '560px',
     
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Empleado creado con éxito',
        });
      }
    });
  }

  openEditarDialog(id: any) {
    this.DTO.setIdEmpleado(id);
    const dialogRef = this.dialog.open(AgregarEmpleadoComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Empleado editado con éxito',
        });
        this.getEmpleados();
      }
    });
  }
  deleteEmpleado(id: any) {
    const dialogRef = this.dialog.open(DialogoDeleteComponent, {
      width: '900px',
      height: '200px',
      data: {
        title: '¿Estás seguro de eliminar?',
        message: 'Ten en cuenta que el empleado será eliminado permanentemente',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.backend.delete(`${environment.api}/Empleado/${id}`).subscribe({
          next: (data: any) => {
            this.getEmpleados();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Empleado eliminado correctamente',
            });
          },
          error: (error) => {
            if(error.error == 'Error, El Empleado está siendo utilizado en la planilla'){
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'No se puede eliminar al empleado porque está dentro de la planilla, eliminelo de la planilla primero',
              });
            }
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
