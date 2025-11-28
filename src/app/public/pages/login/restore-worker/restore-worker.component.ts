import { Component } from '@angular/core';
import {MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';

@Component({
  selector: 'app-restore-worker',
  templateUrl: './restore-worker.component.html',
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    RouterLink,
    MatLabel,
    MatLabel,
    MatLabel,
    MatLabel,
    MatLabel,
    MatLabel,
    MatLabel,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
  ],
  styleUrl: './restore-worker.component.css'
})
export class RestoreWorkerComponent {
  email='';
  password='';
  newpassword='';
  clickAddTodo() {
    alert('Se envio un código de acceso a su correo!');
  }
}
