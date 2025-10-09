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
    ReactiveFormsModule
  ],
  templateUrl: './edit-complaint.html',
  styleUrls: ['./edit-complaint.css']
})
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
    this.http
      .get<any>(`http://localhost:3000/api/v1/complaints/${this.complaintId}`)
      .subscribe({
        next: (data) => {
          this.complaintData = data;
          this.complaintForm.patchValue({
            category: data.category,
            location: data.location,
            referenceInfo: data.referenceInfo,
            description: data.description,
            status: data.status,
            priority: data.priority,
            assignedTo: data.assignedTo,
            updateMessage: data.updateMessage
          });
        },
        error: (err) => console.error('Error loading complaint:', err)
      });
  }

  saveChanges(): void {
    if (this.complaintForm.invalid) return;

    const updatedComplaint = {
      ...this.complaintData,
      ...this.complaintForm.value,
      updateDate: new Date().toISOString()
    };

    this.http
      .put(`http://localhost:3000/api/v1/complaints/${this.complaintId}`, updatedComplaint)
      .subscribe({
        next: () => {
          alert('Denuncia actualizada correctamente ✅');
          void this.router.navigate(['/']);
        },
        error: (err) => console.error('Error updating complaint:', err)
      });
  }

  discardChanges(): void {
    this.complaintForm.reset(this.complaintData);
  }

  openImage(img: string): void {
    this.selectedImage = img;
  }
}
