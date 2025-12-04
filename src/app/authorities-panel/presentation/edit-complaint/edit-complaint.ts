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
  isEditing = false; // Nueva propiedad para controlar el modo edición

  // Lista completa de estados según la entidad
  statuses = [
    'Pending',
    'Completed',
    'Rejected',
    'Awaiting Response',
    'Accepted'
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
      referenceInfo: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }, Validators.required],
      status: [{ value: '', disabled: true }, Validators.required],
      priority: [{ value: '', disabled: true }, Validators.required],
      assignedTo: [{ value: '', disabled: true }, Validators.required],
      updateMessage: [{ value: '', disabled: true }]
    });
  }

  // Nuevo método para alternar el modo edición
  toggleEditMode(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      // Habilitar todos los campos cuando se activa la edición
      this.complaintForm.enable();

      // Mantener algunos campos como solo lectura si es necesario
      this.complaintForm.get('category')?.disable();
      this.complaintForm.get('location')?.disable();
      this.complaintForm.get('description')?.disable();

      this.snackBar.open('Modo edición activado', 'Cerrar', { duration: 2000 });
    } else {
      // Guardar cambios automáticamente al salir del modo edición
      this.saveChanges();
    }
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
        this.isEditing = false; // Salir del modo edición
        this.complaintForm.disable(); // Deshabilitar el formulario
        this.complaintData = response; // Actualizar datos locales
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
      // Recargar datos originales
      this.loadComplaintData();
      this.isEditing = false;
      this.complaintForm.disable();
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

  // Método para avanzar estado (comentado en HTML)
  /*
  advanceStatus(): void {
    // Lógica para avanzar al siguiente estado
    const currentStatus = this.complaintForm.get('status')?.value;
    const currentIndex = this.statuses.indexOf(currentStatus);

    if (currentIndex < this.statuses.length - 1) {
      const nextStatus = this.statuses[currentIndex + 1];
      this.complaintForm.patchValue({
        status: nextStatus,
        updateMessage: `Estado avanzado automáticamente a ${nextStatus}`
      });
      this.saveChanges();
    } else {
      this.snackBar.open('Ya se encuentra en el último estado', 'Cerrar', { duration: 3000 });
    }
  }
  */
}
