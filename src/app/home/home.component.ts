import { Component } from '@angular/core';
import { NotificacionesService } from '../services/notificaciones.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ToastModule, ButtonModule, RippleModule],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}
}
