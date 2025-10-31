import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {SnackbarService} from '../../component/snackbar-component/snackbar.service';
import {TranslatePipe} from '@ngx-translate/core';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.html',
  styleUrls: ['./forgot-password-form.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ]
})
/** @class ForgotPasswordForm
 * @constructor
 * @param {Router} router - Angular Router for navigation.
 * @param {SnackbarService} snackbar - Service for displaying snack bar notifications.
 * @param {HttpClient} http - HttpClient for making HTTP requests.
 * @method navigateToHome - Navigates to the landing page.
 * @method onRecover - Handles the password recovery process, including email validation and user existence check.
 * @author Omar Harold Rivera Ticllacuri
 */
export class ForgotPasswordForm {
  email: string = '';

  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    private http: HttpClient
  ) {}

  navigateToHome() {
    this.router.navigate(['/authentication/login']);
  }

  async onRecover() {
    if (!this.email || !this.email.includes('@')) {
      this.snackbar.show('Please enter a valid email address.', 'red', 4000);
      return;
    }

    try {
      const citizensUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderCitizensEndpointPath}`;
      const authoritiesUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAuthoritiesEndpointPath}`;

      const [citizens, authorities]: any = await Promise.all([
        this.http.get<any[]>(citizensUrl).toPromise(),
        this.http.get<any[]>(authoritiesUrl).toPromise()
      ]);

      const foundUser =
        citizens.find((u: any) => u.email === this.email) ||
        authorities.find((u: any) => u.email === this.email);

      if (foundUser) {
        this.snackbar.show('Account found. Recovery process started successfully!', 'green', 6000);
      } else {
        this.snackbar.show('This email is not registered in our system.', 'red', 5000);
      }
    } catch (err) {
      this.snackbar.show('Server error. Please try again later.', 'red', 5000);
    }
  }
}
