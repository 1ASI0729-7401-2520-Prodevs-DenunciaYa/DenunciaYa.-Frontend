import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

/** A confirmation dialog component that can be reused across the application.
 * It displays a title, a message, and Confirm/Cancel buttons.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <h2>{{ data.title }}</h2>
      <p>{{ data.message }}</p>
      <div class="dialog-actions">
        <button mat-button color="warn" (click)="onCancel()">Cancel</button>
        <button mat-flat-button color="primary" (click)="onConfirm()">Confirm</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      text-align: center;
      padding: 10px;
    }
    h2 {
      margin: 0 0 10px;
      font-size: 20px;
      font-weight: 600;
    }
    p {
      color: #555;
      margin-bottom: 20px;
    }
    .dialog-actions {
      display: flex;
      justify-content: center;
      gap: 10px;
    }
  `]
})
/**
 * @class ConfirmDialogComponent
 * @constructor
 * @param {MatDialogRef<ConfirmDialogComponent>} dialogRef - Reference to the dialog.
 * @param {Object} data - Data passed to the dialog containing title and message.
 * @param {string} data.title - The title of the dialog.
 * @param {string} data.message - The message in the dialog.
 * @method onConfirm - Closes the dialog returning true.
 * @method onCancel - Closes the dialog returning false.
 * @author Omar Harold Rivera Ticllacuri
 */
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
