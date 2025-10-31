import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateModule } from '@ngx-translate/core';
import {Complaint} from '../../../domain/model/complaint.entity';
import {ComplaintsApiService} from '../../../infrastructure/complaint-api';



@Component({
  selector: 'app-complaint-edit-citizen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './complaint-edit-citizen.html',
  styleUrls: ['./complaint-edit-citizen.css']
})
/**
 * @class ComplaintEditCitizen
 * @summary Component for editing citizen complaints.
 * @constructor
 * @param {ActivatedRoute} route - ActivatedRoute for accessing route parameters.
 * @param {Router} router - Router for navigation.
 * @param {FormBuilder} fb - FormBuilder for creating reactive forms.
 * @param {ComplaintsApiService} complaintsService - Service for interacting with the complaints API.
 * @param {MatSnackBar} snackBar - MatSnackBar for displaying notifications.
 * @method ngOnInit - Initializes the component and loads the complaint data.
 * @param {string} id - The ID of the complaint to load.
 * @method onSubmit - Handles form submission for updating the complaint.
 * @method onCancel - Handles cancellation of the edit and navigates back to the complaint detail view.
 * @method hasError - Checks if a form control has a specific error.
 * @param {string} controlName - The name of the form control.
 * @param {string} errorName - The name of the error to check for.
 * @return {boolean} True if the control has the specified error and has been touched, false otherwise.
 * @method isFieldInvalid - Checks if a form control is invalid and has been touched.
 * @param {string} controlName - The name of the form control.
 * @return {boolean} True if the control is invalid and has been touched, false otherwise.
 */
export class ComplaintEditCitizen implements OnInit {
  complaintForm: FormGroup;
  complaint?: Complaint;
  isSubmitting = false;

  categories = [
    'Infrastructure and Public Spaces',
    'Environment',
    'Citizen Security',
    'Transport and Mobility',
    'Public Health',
    'Urban Cleaning',
    'Public Transportation',
    'Others'
  ];

  departments = [
    'Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos',
    'Huancayo', 'Tacna', 'Ica', 'Juliaca', 'Sullana', 'Chincha', 'Huaraz',
    'Pucallpa', 'Tarapoto', 'Puno', 'Cajamarca', 'Ayacucho', 'Huaral'
  ];

  priorities = [
    'Standard',
    'Urgent',
    'Critical'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private complaintsService: ComplaintsApiService,
    private snackBar: MatSnackBar
  ) {
    this.complaintForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadComplaint(id);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      category: ['', Validators.required],
      department: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      location: ['', Validators.required],
      referenceInfo: [''],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['Standard', Validators.required]
    });
  }

  private loadComplaint(id: string): void {
    this.complaintsService.getComplaintById(id).subscribe({
      next: (data) => {
        this.complaint = data;
        this.populateForm(data);
      },
      error: (error) => {
        this.showError('Error al cargar la denuncia');
        this.router.navigate(['/complaints']);
      }
    });
  }

  private populateForm(complaint: Complaint): void {
    this.complaintForm.patchValue({
      category: complaint.category,
      department: complaint.department,
      city: complaint.city,
      district: complaint.district,
      location: complaint.location,
      referenceInfo: complaint.referenceInfo,
      description: complaint.description,
      priority: complaint.priority
    });
  }

  onSubmit(): void {
    if (this.complaintForm.valid && this.complaint) {
      this.isSubmitting = true;

      const updatedComplaint: Complaint = {
        ...this.complaint,
        ...this.complaintForm.value,
        updateDate: new Date().toISOString(),
        updateMessage: 'Denuncia actualizada por el ciudadano'
      };

      this.complaintsService.updateComplaint(updatedComplaint).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showSuccess('Denuncia actualizada correctamente');
          this.router.navigate(['/complaint-list']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showError('Error al actualizar la denuncia');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/complaint-detail', this.complaint?.id]);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.complaintForm.controls).forEach(key => {
      const control = this.complaintForm.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration:1000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.complaintForm.get(controlName);
    return control ? control.hasError(errorName) && control.touched : false;
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.complaintForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
}
