import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ResponsibleCreateStore } from '../../application/responsibleCreate.store';
import { TranslatePipe } from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';
import {Responsible} from '../../domain/model/responsibleCreate.entity';

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
    MatProgressSpinnerModule,
    TranslatePipe,
    MatIconModule
  ],
  templateUrl: './responsible-create.component.html',
  styleUrls: ['./responsible-create.component.css']
})
export class ResponsibleCreateComponent implements OnInit {
  form: FormGroup;

  accessLevels = [
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Técnico', label: 'Técnico' },
    { value: 'Operador', label: 'Operador' }
  ];

  departments = [
    { value: 'Infrastructure and Public Spaces', label: 'Infrastructure and Public Spaces' },
    { value: 'Environment', label: 'Environment' },
    { value: 'Citizen Security', label: 'Citizen Security' },
    { value: 'Public Health', label: 'Public Health' },
    { value: 'Transport and Mobility', label: 'Transport and Mobility' },
    { value: 'Urban Cleaning', label: 'Urban Cleaning' },
    { value: 'Public Transportation', label: 'Public Transportation' },
    { value: 'Others', label: 'Others' }
  ];

  roles = [
    { value: 'Jefe', label: 'Jefe' },
    { value: 'Coordinador', label: 'Coordinador' },
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Especialista', label: 'Especialista' },
    { value: 'Analista', label: 'Analista' },
    { value: 'Inspector', label: 'Inspector' },
    { value: 'Médico', label: 'Médico' },
    { value: 'Enfermera', label: 'Enfermera' },
    { value: 'Operario', label: 'Operario' },
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Asistente', label: 'Asistente' },
    { value: 'Oficial', label: 'Oficial' }
  ];

  constructor(
    private fb: FormBuilder,
    public store: ResponsibleCreateStore
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]{10,}$/)]],
      position: ['', Validators.required],
      department: ['', Validators.required],
      role: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      accessLevel: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.form.value;

    const responsibleData = new Responsible({
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      position: formValue.position,
      department: formValue.department,
      role: formValue.role,
      description: formValue.description,
      accessLevel: formValue.accessLevel,
      status: 'active',
      assignedComplaints: []
    });

    this.store.addResponsible(responsibleData);
    this.form.reset();
  }

  onCancel(): void {
    this.form.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  getFirstNameErrorMessage(): string {
    const control = this.form.get('firstName');
    if (control?.hasError('required')) {
      return 'First name is required';
    }
    if (control?.hasError('minlength')) {
      return 'First name must be at least 2 characters long';
    }
    return '';
  }

  getLastNameErrorMessage(): string {
    const control = this.form.get('lastName');
    if (control?.hasError('required')) {
      return 'Last name is required';
    }
    if (control?.hasError('minlength')) {
      return 'Last name must be at least 2 characters long';
    }
    return '';
  }

  getEmailErrorMessage(): string {
    const control = this.form.get('email');
    if (control?.hasError('required')) {
      return 'Email is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPhoneErrorMessage(): string {
    const control = this.form.get('phone');
    if (control?.hasError('required')) {
      return 'Phone number is required';
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    return '';
  }

  getDescriptionErrorMessage(): string {
    const control = this.form.get('description');
    if (control?.hasError('required')) {
      return 'Description is required';
    }
    if (control?.hasError('minlength')) {
      return 'Description must be at least 10 characters long';
    }
    return '';
  }
}
