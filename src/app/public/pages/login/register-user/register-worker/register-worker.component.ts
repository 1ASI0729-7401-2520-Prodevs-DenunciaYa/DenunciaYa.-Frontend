import { Component } from '@angular/core';
import { RegisterWorkerService } from '../../../../services/register-worker.service';
import {Router, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {TranslatePipe} from '@ngx-translate/core';
@Component({
  selector: 'app-register-owner',
  templateUrl: './register-worker.component.html',
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
  styleUrls: ['./register-worker.component.css']
})
export class RegisterWorkerComponent {
  user = {
    email: '',
    password: '',
    lastName: '',
    firstName: '',
    birthDate: '',
    phoneNumber: '',
    username: '' // lo llenamos con el mismo email
  };

  profile = {
    imageUrl: 'https://imgur.com/YP2XnZT.png',
    workerId: 0
  };

  constructor(private userService: RegisterWorkerService, private router: Router) {}

  onSubmit() {
    this.user.username = this.user.email;

    this.userService.addUser(this.user).subscribe((data: any) => {
      console.log('Usuario creado:', data);
      this.userService.setCurrentUserId(data.id);

      const workerId = data.id;
      if (workerId != null) {
        this.profile.workerId = workerId;
        this.userService.addImageProfile(this.profile).subscribe((profileData: any) => {
          console.log('Perfil creado:', profileData);
          this.router.navigate(['/pages/login-worker']);
        });
      } else {
        console.error('workerId es nulo');
      }
    });
  }
}
