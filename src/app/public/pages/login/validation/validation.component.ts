import { Component } from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatFormField} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
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
    MatLabel,
    FormsModule,
    TranslatePipe,
    MatIconModule
  ],
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent {
  email='';
  code='';
  password='';
  newpassword='';
  clickAddTodo() {
    alert('Se envio un código de acceso a su correo!');
  }
}
