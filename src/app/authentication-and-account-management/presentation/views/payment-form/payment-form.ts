import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatCheckbox,
    MatButton,
    MatNativeDateModule,
    MatError,
    MatIconModule,
    HttpClientModule
  ],
  templateUrl: './payment-form.html',
  styleUrls: ['./payment-form.css']
})
/** @class PaymentForm
 *  @constructor
 *  @param {Router} router - Angular Router for navigation.
 *  @param {HttpClient} http - HttpClient for making HTTP requests.
 *  @method navigateToPlans - Navigates to the subscription plans page.
 *  @method confirmPayment - Confirms the payment and saves user data to the backend.
 *  @author Omar Harold Rivera Ticllacuri
 */
export class PaymentForm {
  constructor(private router: Router, private http: HttpClient) {}

  navigateToPlans() {
    this.router.navigate(['/authentication/plans']);
  }

  confirmPayment() {
    const pendingUser = localStorage.getItem('pendingUser');

    if (pendingUser) {
      const user = JSON.parse(pendingUser);
      user.paymentStatus = 'completed';

      const endpoint =
        user.role === 'authority'
          ? 'http://localhost:3000/authority'
          : 'http://localhost:3000/citizen';

      this.http.post(endpoint, user).subscribe({
        next: () => {
          localStorage.removeItem('pendingUser');
          alert('Payment completed successfully!');
          this.router.navigate(['/home']);
        },
        error: () => {
          alert('Error saving user data.');
        }
      });
    }
  }
}
