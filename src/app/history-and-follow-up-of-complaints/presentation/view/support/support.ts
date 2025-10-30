import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './support.html',
  styleUrl: './support.css'
})
export class SupportHelpComponent {
  supportForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.supportForm = this.fb.group({
      subject: ['', Validators.required],
      complaintNumber: [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  submitSupportRequest(): void {
    if (this.supportForm.valid) {
      const formData = this.supportForm.value;
      console.log('Datos del formulario de soporte:', formData);

      // Aquí iría la lógica para enviar el formulario al backend
      alert('Su solicitud de soporte ha sido enviada. Nos pondremos en contacto pronto.');

      // Resetear el formulario
      this.supportForm.reset();
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.markFormGroupTouched(this.supportForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
