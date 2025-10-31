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
    NgOptimizedImage,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './edit-complaint.html',
  styleUrls: ['./edit-complaint.css']
})
/**
 * @class EditComplaintComponent
 * @constructor
 * @param {FormBuilder} fb - FormBuilder for creating the complaint form.
 * @param {ActivatedRoute} route - ActivatedRoute for accessing route parameters.
 * @param {HttpClient} http - HttpClient for making HTTP requests.
 * @param {Router} router - Angular Router for navigation.
 * @method ngOnInit - Initializes the component and loads complaint data.
 * @param {initForm} - Initializes the complaint form.
 * @param {loadComplaintData} - Loads complaint data from the API.
 * @param {saveChanges} - Saves changes made to the complaint.
 * @param {discardChanges} - Discards changes and navigates back to the complaint list.
 * @param {openImage} - Opens the selected image in a modal.
 * @param {closeImage} - Closes the image modal.
 */
export class EditComplaintComponent implements OnInit {
  complaintForm!: FormGroup;
  complaintId!: string;
  complaintData: any;
  selectedImage: string | null = null;

  statuses = [
    'Pending', 'Under review', 'Awaiting response',
    'Decision pending', 'Completed', 'Rejected'
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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.complaintId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadComplaintData();
  }

  initForm(): void {
    this.complaintForm = this.fb.group({
      category: ['', Validators.required],
      location: ['', Validators.required],
      referenceInfo: [''],
      description: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      assignedTo: ['', Validators.required],
      updateMessage: ['']
    });
  }

  loadComplaintData(): void {
    const apiUrl = `${environment.apiBaseUrl}${environment.apiEndpoints.complaints}/${this.complaintId}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        this.complaintData = data;

        this.complaintForm.patchValue({
          category: data.category || '',
          location: data.location || '',
          referenceInfo: data.referenceInfo || '',
          description: data.description || '',
          status: data.status || 'Pending',
          priority: data.priority || 'Standard',
          assignedTo: data.assignedTo || 'Not assigned',
          updateMessage: data.updateMessage || ''
        });

        this.complaintForm.get('category')?.disable();
        this.complaintForm.get('location')?.disable();
        this.complaintForm.get('referenceInfo')?.disable();
        this.complaintForm.get('description')?.disable();


      },
      error: (err) => {
      }
    });
  }

  saveChanges(): void {
    if (this.complaintForm.invalid) {
      alert('Por favor, complete todos los campos requeridos');
      return;
    }

    const formValue = this.complaintForm.getRawValue();

    const updatedComplaint = {
      ...this.complaintData,
      ...formValue,
      updateDate: new Date().toISOString()
    };

    const apiUrl = `${environment.apiBaseUrl}${environment.apiEndpoints.complaints}/${this.complaintId}`;

    this.http
      .put(apiUrl, updatedComplaint)
      .subscribe({
        next: () => {
          alert('Denuncia actualizada correctamente ✅');
          void this.router.navigate(['/complaint-list']);
        },
        error: (err) => {
          alert('Error al actualizar la denuncia');
        }
      });
  }

  discardChanges(): void {
    if (confirm('¿Está seguro de que desea descartar los cambios?')) {
      void this.router.navigate(['/complaint-list']);
    }
  }

  openImage(img: string): void {
    this.selectedImage = img;
  }

  closeImage(): void {
    this.selectedImage = null;
  }
}
