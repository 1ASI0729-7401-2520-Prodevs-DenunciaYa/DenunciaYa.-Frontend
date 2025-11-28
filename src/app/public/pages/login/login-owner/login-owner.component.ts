import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { RegisterOwnerService } from '../../../services/register-owner.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatFormField} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-login-owner',
  templateUrl: './login-owner.component.html',
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    RouterLink,
    MatLabel,
    MatFormField,
    TranslatePipe,
    MatLabel,
    MatInput,
    FormsModule,

    MatAnchor
  ],
  standalone: true,
  styleUrls: ['./login-owner.component.css']
})
export class LoginOwnerComponent {
  user = {email: '', password: ''};

  constructor(
    private router: Router,
    private registerOwnerService: RegisterOwnerService
  ) {
  }

  onSubmit() {
    this.registerOwnerService.login(this.user.email, this.user.password)
      .subscribe({
        next: (response) => {
          console.log('Login response:', response); // 👈 Agrega esto

          localStorage.setItem('token', response.token);
          localStorage.setItem('onid', response.id);
          this.router.navigate(['/pages/dashboard']);
        },
        error: () => {
          alert('Credenciales incorrectas. Vuelve a intentarlo.');
        }
      });
  }
}
