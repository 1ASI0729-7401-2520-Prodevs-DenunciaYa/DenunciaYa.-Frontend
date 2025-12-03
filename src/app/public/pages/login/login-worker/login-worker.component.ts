import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RegisterWorkerService } from '../../../services/register-worker.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login-worker',
  templateUrl: './login-worker.component.html',
  styleUrls: ['./login-worker.component.css'],
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    RouterLink,
    MatLabel,
    MatFormField,
    MatInput,
    FormsModule,
    MatAnchor,
    TranslatePipe
  ]
})
export class LoginWorkerComponent {
  user = { email: '', password: '' };
  errorMessage = '';

  constructor(
    private router: Router,
    private registerWorkerService: RegisterWorkerService
  ) {}

  onSubmit() {
    this.registerWorkerService.login(this.user.email, this.user.password).subscribe({
      next: (res: any) => {
        if (!res || !res.token) {
          console.error('Login failed: empty or invalid response', res);
          alert('Error al iniciar sesión: respuesta inválida del servidor');
          return;
        }
        const token = res.token;
        try {
          localStorage.setItem('token', token); // si el backend devuelve un JWT
          if (res.id !== undefined && res.id !== null) {
            localStorage.setItem('wid', String(res.id)); // para identificar que es worker
          }
        } catch (e) {
          // ignore storage errors
        }
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const username = payload.sub || payload.email || payload.name || payload.preferred_username;
          if (username) {
            localStorage.setItem('currentUser', username);
          }
        } catch (e) {
          // ignore decoding errors
        }
        this.router.navigate(['/pages/home']);
      },
      error: () => {
        this.errorMessage = 'Credenciales inválidas. Intenta de nuevo.';
      }
    });
  }
}
