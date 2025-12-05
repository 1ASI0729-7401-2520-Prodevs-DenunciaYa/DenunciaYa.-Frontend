import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RegisterWorkerService } from '../../../services/register-worker.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import {AuthService} from '../../../services/auth.service';
import {UpperCasePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

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
    TranslatePipe,
    UpperCasePipe,
    MatIconModule
  ]
})
export class LoginWorkerComponent {
  user = { email: '', password: '' };
  errorMessage = '';

  constructor(
    private router: Router,
    private registerWorkerService: RegisterWorkerService,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.registerWorkerService.login(this.user.email, this.user.password).subscribe({
      next: (res: any) => {
        if (!res || !res.token) {
          console.error('Login failed: empty or invalid response', res);
          alert('Error al iniciar sesión: respuesta inválida del servidor');
          return;
        }
        let token = res.token;
        try {
          token = (typeof token === 'string') ? token.trim() : token;
          if (typeof token === 'string' && ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'")))) {
            token = token.slice(1, -1);
          }
          if (token === 'null' || token === 'undefined') token = null as any;
        } catch (e) {
          token = null as any;
        }

        if (token) {
          try {
            this.authService.setToken(token);
            if (res.id !== undefined && res.id !== null) {
              localStorage.setItem('wid', String(res.id)); // para identificar que es worker
            }
          } catch (e) {
            // ignore storage errors
          }
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
      error: (err) => {
        console.error('Login worker error in component:', err);
        // Mostrar el body crudo del error para facilitar el análisis (incluye stacktrace o JSON del backend)
        const raw = err?.error ?? err;
        const pretty = (typeof raw === 'string') ? raw : JSON.stringify(raw, null, 2);
        this.errorMessage = err?.error?.message || err?.message || 'Credenciales inválidas. Intenta de nuevo.';
        alert(`Error al iniciar sesión:\n${this.errorMessage}\n\nDetalle crudo:\n${pretty}`);
      }
    });
  }
}
