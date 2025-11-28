import { Component } from '@angular/core';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';

@Component({
  selector: 'app-restore-owner',
  templateUrl: './restore-owner.component.html',
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    RouterLink,

    MatLabel,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
  ],
  styleUrls: ['./restore-owner.component.css']
})
export class RestoreOwnerComponent {
  email='';
  code='';
  password='';
  newpassword='';
  clickAddTodo() {
    alert('Se envio un código de acceso a su correo!');
  }
}
