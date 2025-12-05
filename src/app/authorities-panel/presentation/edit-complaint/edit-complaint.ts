
import { Component, OnInit, inject } from '@angular/core';
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
import { ResponsibleApiEndpoint } from '../../../authorities-panel/infrastructure/responsibleCreate-api--endpoint';
import { Responsible } from '../../../authorities-panel/domain/model/responsibleCreate.entity';

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
  isEditing = false;

  statuses = [
    'Pending',
    'Completed',
    'Rejected',
    'Awaiting Response',
    'Accepted'
  ];

  priorities = ['Standard', 'Urgent', 'Critical'];

  assignedOptions: string[] = ['Not assigned'];
  responsibles: Responsible[] = [];
  isLoading = true;
  errorMessage = '';
  loadingResponsibles = true;

  private responsibleApi = inject(ResponsibleApiEndpoint);

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
    this.loadResponsibles();
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

  loadResponsibles(): void {
    this.loadingResponsibles = true;

    this.responsibleApi.getAll().subscribe({
      next: (responsibles: Responsible[]) => {
        this.responsibles = responsibles;

        this.assignedOptions = [
          'Not assigned',
          ...responsibles.map(r => `${r.fullName} - ${r.position || r.role} [${r.id}]`)
        ];



        this.loadingResponsibles = false;
      },
      error: (error) => {
        console.error('❌ Error loading responsibles:', error);
        this.snackBar.open('Error al cargar la lista de responsables', 'Cerrar', { duration: 3000 });
        this.loadingResponsibles = false;
      }
    });
  }

  getResponsibleFromOption(option: string): Responsible | null {
    if (option === 'Not assigned') {
      return null;
    }

    const idMatch = option.match(/\[(.*?)\]/);
    if (idMatch) {
      const id = idMatch[1];
      return this.responsibles.find(r => r.id === id) || null;
    }

    return null;
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.complaintForm.enable();
      this.complaintForm.get('category')?.disable();
      this.complaintForm.get('location')?.disable();
      this.complaintForm.get('description')?.disable();

      this.snackBar.open('Modo edición activado', 'Cerrar', { duration: 2000 });
    } else {
      this.saveChanges();
    }
  }

  loadComplaintData(): void {
    this.isLoading = true;
    this.errorMessage = '';


    this.complaintsApiService.getComplaintById(this.complaintId).subscribe({
      next: (complaint: Complaint) => {


        this.complaintData = complaint;

        if (!this.statuses.includes(complaint.status)) {
        }

        const waitForResponsibles = setInterval(() => {
          if (!this.loadingResponsibles) {
            clearInterval(waitForResponsibles);

            let assignedToValue = 'Not assigned';

            if (complaint.assignedTo && complaint.assignedTo !== 'Not assigned') {
              const matchingOption = this.assignedOptions.find(option =>
                option === complaint.assignedTo ||
                option.includes(complaint.assignedTo || '')
              );

              if (matchingOption) {
                assignedToValue = matchingOption;
              } else {
                assignedToValue = complaint.assignedTo;
              }
            }

            this.complaintForm.patchValue({
              category: complaint.category || '',
              location: complaint.location || '',
              referenceInfo: complaint.referenceInfo || '',
              description: complaint.description || '',
              status: complaint.status || 'Pending',
              priority: complaint.priority || 'Standard',
              assignedTo: assignedToValue,
              updateMessage: complaint.updateMessage || ''
            });


            this.isLoading = false;
          }
        }, 100);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  saveChanges(): void {
    if (this.complaintForm.invalid) {
      this.markFormGroupTouched(this.complaintForm);
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!this.complaintData) {
      this.snackBar.open('No hay datos de denuncia para actualizar', 'Cerrar', { duration: 3000 });
      return;
    }

    const formValue = this.complaintForm.getRawValue();


    if (!this.statuses.includes(formValue.status)) {
      this.snackBar.open(`Estado "${formValue.status}" no es válido`, 'Cerrar', { duration: 3000 });
      return;
    }

    const assignedResponsible = this.getResponsibleFromOption(formValue.assignedTo);

    let updateMessage = formValue.updateMessage || '';
    if (!updateMessage) {
      if (assignedResponsible) {
        updateMessage = `Assigned to ${assignedResponsible.fullName}`;
      } else if (formValue.assignedTo === 'Not assigned') {
        updateMessage = 'Responsible unassigned';
      } else {
        updateMessage = `Status changed to ${formValue.status}`;
      }
    }

    const updatedComplaint = new Complaint({
      ...this.complaintData,
      id: this.complaintId,
      status: formValue.status,
      priority: formValue.priority,
      assignedTo: formValue.assignedTo,
      referenceInfo: formValue.referenceInfo || '',
      updateMessage: updateMessage,
      updateDate: new Date().toISOString()
    });



    this.complaintsApiService.updateComplaint(updatedComplaint).subscribe({
      next: (response) => {


        this.snackBar.open('Denuncia actualizada correctamente', 'Cerrar', { duration: 3000 });
        this.isEditing = false;
        this.complaintForm.disable();
        this.complaintData = response;

        if (assignedResponsible && assignedResponsible.id) {
          this.updateResponsibleComplaints(assignedResponsible.id, this.complaintId);
        }
      },
      error: (err) => {
        console.error('❌ Update error:', err);
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

  private updateResponsibleComplaints(responsibleId: string, complaintId: string): void {

    this.snackBar.open(`Denuncia asignada al responsable`, 'Cerrar', { duration: 2000 });
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
}
