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
  selector: 'app-recover-password-worker',
  templateUrl: './recover-password-worker.component.html',
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    RouterLink,
    MatIconModule,
    MatLabel,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    TranslatePipe,
  ],
  styleUrls: ['./recover-password-worker.component.css']
})
export class RecoverPasswordWorkerComponent {
  email='';
  code='';
  clickAddTodo() {
    alert('Se envio un código de acceso a su correo!');
  }
}
