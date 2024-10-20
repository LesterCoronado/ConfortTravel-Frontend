import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../services/backend.service';
import { environment } from '../environments/environments.prod';
import { Router } from '@angular/router';
import moment from 'moment';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-registro-usuarios',
  standalone: true,
  imports: [ ReactiveFormsModule,
    FormsModule,
    PasswordModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    InputNumberModule 
  ],
  templateUrl: './registro-usuarios.component.html',
  styleUrl: './registro-usuarios.component.css',
 
})
export class RegistroUsuariosComponent {
  crearFormulario: FormGroup;
  btnEnviar: boolean = true;
  btnBlock: boolean = false;
  value!: string;

  constructor(
    public fb: FormBuilder, 
    private backend : BackendService,
    private routerprd: Router,
    private ngZone: NgZone
  ) {
    this.crearFormulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      sexo: ['', Validators.required],
      correo: ['', Validators.required],
      contraseña: ['', Validators.required],
      fechaCreacion: ['', Validators.required]
    });
   }
   ngOnInit() 
   {
    const HoraActual = moment();
    let fecha = HoraActual.format('YYYY-MM-DDTHH:mm:ss.sss[Z]')
    console.log(fecha);
   }
   formulario()
   {
    const HoraActual = moment();
    let fecha = HoraActual.format('YYYY-MM-DDTHH:mm:ss.sss[Z]')
    // Usa patchValue para actualizar solo el campo 'fechaCreacion'
  this.crearFormulario.patchValue({
    fechaCreacion: fecha
  });
     if(this.crearFormulario.invalid) {
       alert("Complete el formulario")
       console.log(this.crearFormulario.value)
     }
     else {
      console.log(this.crearFormulario.value)
       this.btnEnviar = false;
       this.btnBlock = true;
       this.backend.post(
        `${environment.api}/Login`,
        this.crearFormulario.value
       )
       .subscribe(  
         {
           next: (data : any) =>{
            //  this.btnBlock = false;
 
             this.ngZone.run(()=> {
            //  this.btnEnviar = true;
             console.log(data)
 
             this.routerprd.navigate(['/login']);
             alert("Usuario creado con exito, inicie sesion para continuar")
             })
             
           },
           error: (error) =>{
             this.btnBlock = false;
             this.btnEnviar = true;
             alert("Uno o mas campos son incorrectos")
 
             if(error.error  == 'usuario no encontrado')
               {
                 alert("Usuario no encontrado")
               }
 
               else {
              
               }
           
             
           }
           
         }
       )
     }
      
     }
}
