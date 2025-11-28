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
        localStorage.setItem('token', res.token); // si el backend devuelve un JWT
        localStorage.setItem('wid', res.id.toString()); // para identificar que es worker
        this.router.navigate(['/pages/home']);
      },
      error: () => {
        this.errorMessage = 'Credenciales inválidas. Intenta de nuevo.';
      }
    });
  }
}
