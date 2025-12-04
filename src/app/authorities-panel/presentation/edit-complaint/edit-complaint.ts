import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  CommonModule,
  NgOptimizedImage,
} from '@angular/common';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import {
  MatInputModule
} from '@angular/material/input';
import {
  MatSelectModule
} from '@angular/material/select';
import {
  MatButtonModule
} from '@angular/material/button';
import {environment} from '../../../../environments/environment';
import {TranslatePipe} from '@ngx-translate/core';
import {Complaint} from '../../../complaint-creation/domain/model/complaint.entity';
import {ComplaintsApiService} from '../../../complaint-creation/infrastructure/complaint-api';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-complaint',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-complaint.html',
  styleUrls: ['./edit-complaint.css']
})
export class EditComplaintComponent implements OnInit {
  complaintForm!: FormGroup;
  complaintId!: string;
  complaintData: Complaint | null = null;
  selectedImage: string | null = null;

  // Lista completa de estados según la entidad
  statuses = [
    'Pending',
    'In Process',
    'Completed',
    'Rejected',
    'Awaiting Response',
    'Accepted',
    'Under Review'
  ];

  priorities = ['Standard', 'Urgent', 'Critical'];

  assignedOptions = [
    'Carlos Méndez - Maintenance Chief',
    'María Torres - Environmental Inspector',
    'Roberto Silva - Security Coordinator',
    'Juan Pérez - Traffic Engineer',
    'Laura Gutierrez - Health Inspector',
    'Not assigned'
  ];

  isLoading = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private complaintsApiService: ComplaintsApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.complaintId = this.route.snapshot.paramMap.get('id')!;
    if (!this.complaintId) {
      this.errorMessage = 'No se proporcionó ID de complaint';
      return;
    }
    this.initForm();
    this.loadComplaintData();
  }

  initForm(): void {
    this.complaintForm = this.fb.group({
      category: [{ value: '', disabled: true }, Validators.required],
      location: [{ value: '', disabled: true }, Validators.required],
      referenceInfo: [{ value: '', disabled: false }],
      description: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      assignedTo: ['', Validators.required],
      updateMessage: ['']
    });
  }

  loadComplaintData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('📥 Loading complaint with ID:', this.complaintId);

    this.complaintsApiService.getComplaintById(this.complaintId).subscribe({
      next: (complaint: Complaint) => {
        console.log('✅ Complaint loaded successfully:', complaint);
        console.log('📊 Complaint details:');
        console.log('  - Status:', complaint.status);
        console.log('  - Priority:', complaint.priority);
        console.log('  - Update Message:', complaint.updateMessage);
        console.log('  - Assigned To:', complaint.assignedTo);

        this.complaintData = complaint;

        // Verificar que el estado esté en la lista permitida
        if (!this.statuses.includes(complaint.status)) {
          console.warn(`⚠️ Status "${complaint.status}" not in allowed list, defaulting to "Pending"`);
        }

        // Rellenar el formulario
        this.complaintForm.patchValue({
          category: complaint.category || '',
          location: complaint.location || '',
          referenceInfo: complaint.referenceInfo || '',
          description: complaint.description || '',
          status: complaint.status || 'Pending',
          priority: complaint.priority || 'Standard',
          assignedTo: complaint.assignedTo || 'Not assigned',
          updateMessage: complaint.updateMessage || ''
        });

        console.log('✅ Form populated with values:');
        console.log('  - Form status:', this.complaintForm.get('status')?.value);
        console.log('  - Form priority:', this.complaintForm.get('priority')?.value);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading complaint:', err);
        this.errorMessage = `Error al cargar los datos de la denuncia: ${err.message}`;
        this.isLoading = false;
        this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  saveChanges(): void {
    if (this.complaintForm.invalid) {
      console.log('❌ Form is invalid:', this.complaintForm.errors);
      this.markFormGroupTouched(this.complaintForm);
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!this.complaintData) {
      this.snackBar.open('No hay datos de denuncia para actualizar', 'Cerrar', { duration: 3000 });
      return;
    }

    const formValue = this.complaintForm.getRawValue();

    console.log('💾 === SAVE CHANGES DEBUG ===');
    console.log('Form values:', formValue);
    console.log('Selected status:', formValue.status);
    console.log('Selected priority:', formValue.priority);

    // Validar que el estado sea válido
    if (!this.statuses.includes(formValue.status)) {
      this.snackBar.open(`Estado "${formValue.status}" no es válido`, 'Cerrar', { duration: 3000 });
      return;
    }

    // Crear objeto actualizado
    const updatedComplaint = new Complaint({
      ...this.complaintData,
      id: this.complaintId,
      status: formValue.status,
      priority: formValue.priority,
      assignedTo: formValue.assignedTo,
      referenceInfo: formValue.referenceInfo || '',
      updateMessage: formValue.updateMessage || `Status changed to ${formValue.status}`,
      updateDate: new Date().toISOString()
    });

    console.log('📤 Sending updated complaint to backend:');
    console.log('  - ID:', updatedComplaint.id);
    console.log('  - Status (frontend):', updatedComplaint.status);
    console.log('  - Update Message:', updatedComplaint.updateMessage);

    this.complaintsApiService.updateComplaint(updatedComplaint).subscribe({
      next: (response) => {
        console.log('✅ Update successful:', response);
        console.log('  - Response status:', response.status);
        console.log('  - Response updateMessage:', response.updateMessage);

        this.snackBar.open('Denuncia actualizada correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/complaint-list']);
      },
      error: (err) => {
        console.error('❌ Update error:', err);
        console.error('  - Error status:', err.status);
        console.error('  - Error message:', err.message);
        console.error('  - Error details:', err.error);

        let errorMessage = 'Error al actualizar la denuncia';
        if (err.error?.message) {
          errorMessage += `: ${err.error.message}`;
        } else if (err.message) {
          errorMessage += `: ${err.message}`;
        }

        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  discardChanges(): void {
    if (confirm('¿Está seguro de que desea descartar los cambios?')) {
      this.router.navigate(['/complaint-list']);
    }
  }

  openImage(img: string): void {
    this.selectedImage = img;
  }

  closeImage(): void {
    this.selectedImage = null;
  }

  trackByImage(index: number, img: string): string {
    return img;
  }
}
