import { Component } from '@angular/core';
import { NotificacionesService } from '../services/notificaciones.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BackendService } from '../services/backend.service';
import { environment } from '../environments/environments.prod';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ToastModule, ButtonModule, RippleModule],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private messageService: MessageService, private backend: BackendService) {}

  ngOnInit(): void {
    this.backend.get(`${environment.api}/Empleado`).subscribe({
      next: (data: any) => {
        console.log("hurray");
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
