import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {SnackbarComponent, SnackbarData} from './snackbar-component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  show(message: string, color: 'red' | 'yellow' | 'green' | 'blue', duration: number = 7000) {
    const data: SnackbarData = { message, color, duration };
    this.snackBar.openFromComponent(SnackbarComponent, {
      data,
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${color}`]
    });
  }
}
