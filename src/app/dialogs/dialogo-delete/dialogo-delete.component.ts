import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from '../../services/backend.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dialogo-delete',
  standalone: true,
  imports: [MatDialogModule, MatButton, MatIcon],
  templateUrl: './dialogo-delete.component.html',
  styleUrl: './dialogo-delete.component.css',
  host: {
    'class': 'confirm-dialog'
  }
})
export class DialogoDeleteComponent {
  
  constructor(
    private dialogRef : MatDialogRef<DialogoDeleteComponent>,
    private  backend: BackendService,
    @Inject (MAT_DIALOG_DATA) public data:any,

  ) { }

  onCancelClick(): void {
    this.dialogRef.close(false); // Cierra el diálogo y pasa `false` como resultado
  }

  onConfirmClick(): void {
    this.dialogRef.close(true); // Cierra el diálogo y pasa `true` como resultado
  }
}
