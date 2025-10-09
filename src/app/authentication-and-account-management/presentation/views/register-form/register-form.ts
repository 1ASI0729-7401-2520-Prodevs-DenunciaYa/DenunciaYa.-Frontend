import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {SnackbarService} from '../../component/snackbar-component/snackbar.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatIconButton,
    MatCheckbox,
    MatError,
    MatButton,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, HttpClientModule, TranslatePipe
  ]
})
/** @class RegisterComponent
 * @constructor
 * @param {FormBuilder} fb - FormBuilder for creating the registration form.
 * @param {Router} router - Angular Router for navigation.
 * @param {SnackbarService} snackbar - Service for displaying snack bar notifications.
 * @param {HttpClient} http - HttpClient for making HTTP requests.
 * @method selectRole - Selects the user role (citizen or authority).
 * @method navigateToLogin - Navigates to the login page.
 * @method onRegister - Handles the registration process, including form validation and user data storage.
 * @author Omar Harold Rivera Ticllacuri
 */
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  selectedRole: string = 'citizen';

  namePattern = /^[a-zA-Z\s]+$/;

  constructor(private fb: FormBuilder, private router: Router, private snackbar: SnackbarService,  private http: HttpClient) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      lastName: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      phone: ['', [Validators.min(900000000), Validators.max(999999999)]],
      terms: [false, Validators.requiredTrue]
    });
  }

  selectRole(role: string) {
    this.selectedRole = role;
  }

  navigateToLogin() {
    this.router.navigate(['/authentication/login']);
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.snackbar.show('Please correct the errors in the form!', 'red', 7000);
      this.registerForm.markAllAsTouched();
      return;
    }

    const user = {
      ...this.registerForm.value,
      id: Math.floor(Math.random() * 1000000),
      role: this.selectedRole,
      plan: '',
      paymentStatus: 'pending'
    };

    localStorage.setItem('pendingUser', JSON.stringify(user));

    this.snackbar.show('User registered! Continue selecting a plan.', 'green', 4000);
    this.router.navigate(['/authentication/plan']);
  }


}
