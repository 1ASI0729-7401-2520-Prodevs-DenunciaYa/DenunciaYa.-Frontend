import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ResponsibleCreateStore } from '../../application/responsibleCreate.store';
import { Responsible } from '../../domain/model/responsibleCreate.entity';

@Component({
  selector: 'app-responsible-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './responsible-create.component.html',
  styleUrls: ['./responsible-create.component.css']
})
export class ResponsibleCreateComponent implements OnInit {
  form: FormGroup;

  accessLevels = [
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Operador', label: 'Operador' }
  ];

  areas = [
    { value: 'Limpieza Pública', label: 'Limpieza Pública' },
    { value: 'Infraestructura', label: 'Infraestructura' },
    { value: 'Seguridad Ciudadana', label: 'Seguridad Ciudadana' },
  ];

  constructor(
    private fb: FormBuilder,
    public store: ResponsibleCreateStore
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      role: ['', Validators.required],
      description: ['', Validators.required],
      accessLevel: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) return;

    const value = this.form.value as Responsible;
    this.store.addResponsible(value);
    this.form.reset();
  }

  onCancel(): void {
    this.form.reset();
  }
}
