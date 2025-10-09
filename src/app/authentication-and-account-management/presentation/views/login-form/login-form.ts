import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton } from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../infrastructure/auth.service';
import {SnackbarService} from '../../component/snackbar-component/snackbar.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormField,
    MatLabel,
    MatError,
    MatCheckbox,
    MatButton,
    MatIconButton,
    MatInput,
    MatIcon,
    MatRadioButton
  ],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css']
})
/** @class LoginForm
 * @constructor
 * @param {FormBuilder} fb - FormBuilder for creating the login form.
 * @param {Router} router - Angular Router for navigation.
 * @param {SnackbarService} snackbar - Service for displaying snack bar notifications.
 * @param {AuthService} authService - Service for handling authentication.
 * @method selectRole - Selects the user role (citizen or authority).
 * @method navigateToHome - Navigates to the landing page.
 * @method onLogin - Handles the login process, including form validation and user authentication.
 * @method navigateToRegister - Navigates to the registration page.
 * @method navigateToForgotAccount - Navigates to the forgot password page.
 * @author Omar Harold Rivera Ticllacuri
 */
export class LoginForm {
  loginForm: FormGroup;
  selectedRole: 'citizen' | 'authority' = 'citizen';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: SnackbarService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  selectRole(role: 'citizen' | 'authority') {
    this.selectedRole = role;
  }

  navigateToHome() {
    window.location.href =
      'https://1asi0729-7401-2520-prodevs-denunciaya.github.io/DenunciaYa-Landing-Page/';
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.snackbar.show('Please fill in all required fields correctly.', 'red');
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      const user = await this.authService.login(email, password, this.selectedRole);

      if (!user) {
        this.snackbar.show('Incorrect email or password!', 'red', 5000);
        return;
      }

      this.snackbar.show(`Welcome, ${user.firstName}!`, 'green', 3000);

      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'autoridad') {
        this.router.navigate(['/authority/dashboard']);
      } else {
        this.router.navigate(['/citizen/home']);
      }
    } catch (err) {
      console.error('Login error:', err);
      this.snackbar.show('Server error, please try again later.', 'red');
    }
  }

  navigateToRegister() {
    this.router.navigate(['/authentication/register']);
  }

  navigateToForgotAccount() {
    this.router.navigate(['/authentication/forgot-password']);
  }
}
