import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
@Component({
  selector: 'app-reset-password-form',
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule, TranslatePipe],
  templateUrl: './reset-password-form.html',
  styleUrl: './reset-password-form.css'
})
/** @class ResetPasswordForm
 * @constructor
 * @param {Router} router - Angular Router for navigation.
 * @method navigateToLogin - Navigates to the login page.
 * @method onReset - Handles the password reset action and navigates to login.
 * @author Omar Harold Rivera Ticllacuri
 */
export class ResetPasswordForm {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onReset() {
    this.router.navigate(['/login']);
  }
}
