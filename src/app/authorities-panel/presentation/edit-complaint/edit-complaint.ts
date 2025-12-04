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
  complaintData: Complaint | null = null; // Usar la entidad
  selectedImage: string | null = null;

  // Ajusta los estados para que coincidan con la entidad
  statuses = [
    'Pending', 'In Process',
    'Completed', 'Rejected',  'Awaiting response'
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
    private complaintsApiService: ComplaintsApiService // Inyectar el servicio
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
      referenceInfo: ['', Validators.required], // ¡CORREGIDO! Quitado "disabled: true"
      description: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required], // ¡CORREGIDO! Quitado "disabled: false" (es el valor por defecto)
      priority: ['', Validators.required],
      assignedTo: ['', Validators.required],
      updateMessage: [''] // Debe estar sin validators.required si es opcional
    });
  }
  loadComplaintData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Loading complaint with ID:', this.complaintId);

    this.complaintsApiService.getComplaintById(this.complaintId).subscribe({
      next: (complaint: Complaint) => {
        console.log('Complaint loaded successfully:', complaint);
        this.complaintData = complaint;

        // Debug: verificar todos los campos
        console.log('Complaint status:', complaint.status);
        console.log('Complaint updateMessage:', complaint.updateMessage);
        console.log('Complaint referenceInfo:', complaint.referenceInfo);

        // Rellenar el formulario con los datos de la entidad
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

        // Verificar que los valores se hayan establecido correctamente
        console.log('Form status value:', this.complaintForm.get('status')?.value);
        console.log('Form updateMessage value:', this.complaintForm.get('updateMessage')?.value);
        console.log('Form referenceInfo value:', this.complaintForm.get('referenceInfo')?.value);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading complaint:', err);
        this.errorMessage = `Error al cargar los datos de la denuncia: ${err.message}`;
        this.isLoading = false;
      }
    });
  }


  saveChanges(): void {
    if (this.complaintForm.invalid) {
      console.log('Form is invalid:', this.complaintForm.errors);
      console.log('Form controls:', this.complaintForm.controls);
      alert('Por favor, complete todos los campos requeridos');
      return;
    }

    if (!this.complaintData) {
      alert('No hay datos de denuncia para actualizar');
      return;
    }

    const formValue = this.complaintForm.getRawValue();

    // Debug detallado de los valores del formulario
    console.log('=== SAVE CHANGES DEBUG ===');
    console.log('Form values to save:', formValue);
    console.log('status value:', formValue.status);
    console.log('updateMessage value:', formValue.updateMessage);
    console.log('referenceInfo value:', formValue.referenceInfo);
    console.log('priority value:', formValue.priority);

    // Asegúrate de usar el ID correcto
    const complaintIdToUse = this.complaintId || this.complaintData.id;

    if (!complaintIdToUse || complaintIdToUse === '') {
      alert('Error: ID de denuncia no válido');
      return;
    }

    // Crear un nuevo objeto Complaint con todos los datos actualizados
    const updatedComplaint = new Complaint({
      ...this.complaintData, // Mantiene los datos originales
      id: complaintIdToUse,
      status: formValue.status,
      priority: formValue.priority,
      assignedTo: formValue.assignedTo,
      referenceInfo: formValue.referenceInfo || '', // Asegurar que no sea undefined
      updateMessage: formValue.updateMessage || '', // Asegurar que no sea undefined
      updateDate: new Date().toISOString()
    });

    // Debug del objeto que se enviará
    console.log('=== UPDATED COMPLAINT OBJECT ===');
    console.log('Status:', updatedComplaint.status);
    console.log('UpdateMessage:', updatedComplaint.updateMessage);
    console.log('ReferenceInfo:', updatedComplaint.referenceInfo);
    console.log('Priority:', updatedComplaint.priority);

    this.complaintsApiService.updateComplaint(updatedComplaint).subscribe({
      next: (response) => {
        console.log('=== UPDATE RESPONSE ===');
        console.log('Update response:', response);
        console.log('Response status:', response.status);
        console.log('Response updateMessage:', response.updateMessage);
        console.log('Response referenceInfo:', response.referenceInfo);

        alert('Denuncia actualizada correctamente');
        this.router.navigate(['/complaint-list']);
      },
      error: (err) => {
        console.error('=== UPDATE ERROR ===');
        console.error('Error updating complaint:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error details:', err.error);

        alert(`Error al actualizar la denuncia: ${err.message}`);
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
