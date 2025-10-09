import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {NgStyle} from '@angular/common';

export interface SnackbarData {
  message: string;
  color: 'red' | 'yellow' | 'green' | 'blue';
  duration?: number;
}
@Component({
  selector: 'app-snackbar',
  template: `
    <div class="snackbar-content" [ngStyle]="{'background-color': data.color, 'color': textColor}">
      {{ data.message }}
    </div>
  `,
  imports: [
    NgStyle
  ],
  styles: [`
    .snackbar-content {
      padding: 1rem 1.5rem;
      border-radius: 5px;
      font-weight: 500;
      font-size: 14px;
    }
  `]
})
export class SnackbarComponent {
  textColor: string = 'white';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    private snackBarRef: MatSnackBarRef<SnackbarComponent>
  ) {
    this.textColor = data.color === 'yellow' ? 'black' : 'white';
  }
}
