import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { RegisterOwnerService } from '../../../services/register-owner.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatFormField} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthService} from '../../../services/auth.service';

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
    private registerOwnerService: RegisterOwnerService,
    private authService: AuthService
  ) {
  }

  onSubmit() {
    this.registerOwnerService.login(this.user.email, this.user.password)
      .subscribe({
        next: (response) => {

          let token = response.token;
          // Sanitizar token: quitar comillas envolventes si existen y valores 'null'/'undefined'
          try {
            if (typeof token === 'string') {
              token = token.trim();
              // quitar comillas envolventes
              if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
                token = token.slice(1, -1);
              }
              if (token === 'null' || token === 'undefined') {
                token = null as any;
              }
            }
          } catch (e) {
            token = null as any;
          }

          if (token) {
            this.authService.setToken(token);
          }

          localStorage.setItem('onid', response.id);
          // Guardar currentUser decodificando el token (si contiene sub/email)
          try {
            if (token) {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const username = payload.sub || payload.email || payload.name || payload.preferred_username;
              if (username) {
                localStorage.setItem('currentUser', username);
              }
            }
          } catch (e) {
            // ignore
          }

          this.router.navigate(['/pages/dashboard']);
        },
        error: () => {
          alert('Credenciales incorrectas. Vuelve a intentarlo.');
        }
      });
  }
}
