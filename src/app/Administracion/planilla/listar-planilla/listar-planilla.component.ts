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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { MatInputModule } from '@angular/material/input';
import { DialogModule } from 'primeng/dialog';
import { AgregarPlanillaComponent } from '../agregar-planilla/agregar-planilla.component';
import { BonosComponent } from '../bonos/bonos/bonos.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DescuentosComponent } from '../descuentos/descuentos/descuentos.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import moment from 'moment';

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
    ReactiveFormsModule,
    FormsModule,
    InputSwitchModule
  ],
  providers: [MessageService],
  templateUrl: './listar-planilla.component.html',
  styleUrl: './listar-planilla.component.css',
})
export class ListarPlanillaComponent {
  crearBonoFormulario: FormGroup;
  crearDescuentoFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  listaPlanilla: any = [];
  listaBonos: any = [];
  totalBonos: number = 0;
  listaDescuentos: any = [];
  totalDescuentos: number = 0;
  visible: boolean = false;
  bonosChecked: boolean = false;
  descuentosChecked: boolean = false;
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
    'bonos',
    'descuentos',
    'estado',
    'acciones',
  ];
  dataSource = new MatTableDataSource();
  constructor(
    private backend: BackendService,
    private DTO: DTOService,
    public dialog: MatDialog,
    private notificaciones: NotificacionesService,
    private messageService: MessageService,
    public fb: FormBuilder
  ) {
    this.crearBonoFormulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      monto: [0, Validators.required],
      // frecuenciaPago: ['', Validators.required],
    });
    this.crearDescuentoFormulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      monto: [0, Validators.required],
      // frecuenciaDescuento: ['', Validators.required],
    });
  }
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

  openBonosDialog() {
    const dialogRef = this.dialog.open(BonosComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Bono Asignado Correctamente',
        });
      }
      if (result === false) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al asignar el bono, intente nuevamente',
        });
      }
    });
  }
  openDescuentosDialog() {
    const dialogRef = this.dialog.open(DescuentosComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Descuento Asignado Correctamente',
        });
      }
      if (result === false) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al asignar el descuento, intente nuevamente',
        });
      }
    });
  }

  BonoModal(id: any) {
    console.log(id);
    this.backend.get(`${environment.api}/AsignarBono/${id}`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.listaBonos = data;
        this.totalBonos = 0;
        for (var i = 0; i < this.listaBonos.length; i++) {
          this.totalBonos += this.listaBonos[i].monto;
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  DescuentoModal(id: any) {
    console.log(id);
    this.backend.get(`${environment.api}/AsignarDescuento/${id}`).subscribe({
      next: (data: any) => {
        console.log(data);
        this.listaDescuentos = data;
        this.totalDescuentos = 0;
        for (var i = 0; i < this.listaDescuentos.length; i++) {
          this.totalDescuentos += this.listaDescuentos[i].monto;
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  //funcion para crear un nuevo Bono
  BonosFormulario() {
    console.log(this.crearBonoFormulario.value);
    if (this.crearBonoFormulario.invalid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Complete todos los campos',
      });
    } else {
      this.backend
        .post(`${environment.api}/Bono`, this.crearBonoFormulario.value)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Bono creado correctamente',
            });
            this.crearBonoFormulario.reset();
            this.notificaciones.notificarNuevoBono();
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear el bono, intente nuevamente',
            });
          },
        });
    }
  }

  //funcion para crear un nuevo Descuento
  DescuentosFormulario() {
    console.log(this.crearDescuentoFormulario.value);
    if (this.crearDescuentoFormulario.invalid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Complete todos los campos',
      });
    } else {
      this.backend
        .post(
          `${environment.api}/Descuento`,
          this.crearDescuentoFormulario.value
        )
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Descuento creado correctamente',
            });
            this.crearDescuentoFormulario.reset();
            this.notificaciones.notificarNuevoDescuento();
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear el bono, intente nuevamente',
            });
          },
        });
    }
  }
  showPagoPlanillaDialog() {
    this.visible = true;
  }

  PagoPlanilla() {
    this.btnBlock = true;
    this.btnEnviar = false;
    this.backend
      .getCSV(`${environment.api}/PagoPlanilla/export-csv?incluirBonos=${this.bonosChecked}&incluirDescuentos=${this.descuentosChecked}`)
      .subscribe({
        next: (data: any) => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(data);
          
          // Usar moment.js para obtener la fecha y hora actual
          const fechaHora = moment().format('DD-MM-YYYY_HHmmss'); // Formato deseado
          a.href = objectUrl;
          a.download = `CT_pagos_planilla_${fechaHora}.csv`; // Nombre del archivo con fecha y hora
          a.click();
          URL.revokeObjectURL(objectUrl); // Limpiar el objeto URL
 
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Archivo descargado correctamente',
          });
          this.btnBlock = false;
          this.btnEnviar = true;
        },
        error: (error) => {
          this.btnBlock = false;
          this.btnEnviar = true;
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al generar archivo, intente nuevamente',
          });
        },
      });
}

  
  
  
}
