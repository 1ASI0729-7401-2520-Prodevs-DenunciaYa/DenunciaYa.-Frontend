import { Component } from '@angular/core';
import {RegisterOwnerService} from "../../../../services/register-owner.service";
import { tap } from 'rxjs/operators';

import {Router, RouterLink} from "@angular/router";
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {TranslatePipe} from '@ngx-translate/core';
@Component({
  selector: 'app-register-owner',
  templateUrl: './register-owner.component.html',
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    RouterLink,
    MatLabel,
    MatFormField,
    MatInput,
    FormsModule,
    TranslatePipe,
  ],
  standalone: true,
  styleUrls: ['./register-owner.component.css']
})
export class RegisterOwnerComponent {

  user = {
    username: '',
    email: '',
    password: '',
    lastName: '',
    firstName: '',
    birthDate: '',
    phoneNumber: ''
  };


  profile = {imageUrl: 'https://imgur.com/YP2XnZT.png', ownerId: 0};

  constructor(private userService: RegisterOwnerService, private router: Router) {
  }

  onSubmit() {
    this.user.username = this.user.email;

    this.userService.addUser(this.user).subscribe((data: any) => {
      console.log('Usuario creado:', data);
      const ownerId = data.id;
      this.userService.setCurrentUserId(ownerId);

      // ✅ Crear perfil con los campos correctos
      const profile = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        birthDate: this.user.birthDate,
        phoneNumber: this.user.phoneNumber,
        userId: ownerId
      };

      this.userService.addimageprofile(profile).subscribe({
        next: (res: any) => {
          console.log('Perfil creado:', res);
          this.router.navigate(['/pages/login-owner']);
        },
        error: (err) => {
          console.error('Error al crear perfil', err);
        }
      });
    });
  }

}
