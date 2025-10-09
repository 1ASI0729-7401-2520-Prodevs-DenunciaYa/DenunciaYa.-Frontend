import { Component, inject } from '@angular/core';
import {FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ComplaintsStore } from '../../../application/complaints-store';
import {ActivatedRoute, Router} from '@angular/router';
import {Complaint} from '../../../domain/model/complaint.entity';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-complaint-form',
  templateUrl: './complaint-form.html',
  styleUrl: './complaint-form.css',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule,
    ],
})
export class ComplaintForm {
  private fb = inject(FormBuilder);
  private store = inject(ComplaintsStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  //cambiar luego usando un base-api-endpint
  private http = inject(HttpClient);

  form = this.fb.group({
    category: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    department: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    district: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    referenceInfo: new FormControl<string>('', { nonNullable: true }),
    description: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    evidence: new FormControl<string[]> ([]),
    priority: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    anonymous: new FormControl<boolean>(false),
    termsAccepted: new FormControl<boolean>(false, { validators: [Validators.requiredTrue] })
  });

  isEditMode = false;
  complaintId: string | null = null;

  constructor() {
    this.route.params.subscribe(params => {
      this.complaintId = params['id'] ?? null;
      this.isEditMode = !!this.complaintId;
      if (this.isEditMode) {
        const complaint = this.store.getComplaintById(this.complaintId)();
        if (complaint) {
          this.form.patchValue({
            category: complaint.category,
            department: complaint.department,
            city: complaint.city,
            district: complaint.district,
            referenceInfo: complaint.referenceInfo,
            description: complaint.description,
            evidence: complaint.evidence,
            priority: complaint.priority,
            anonymous: true,
            termsAccepted: true
          });
        }
      }
    });
  }

  submitComplaint() {
    if (this.form.invalid) return;

    // Asegura que priority sea uno de los valores permitidos
    const allowedPriorities = ['Standard', 'Urgent', 'Critical'] as const;
    const priorityValue = allowedPriorities.includes(this.form.value.priority as any)
      ? this.form.value.priority as Complaint['priority']
      : 'Standard';

    // Asegura que evidence nunca sea null o undefined
    const evidenceValue = this.form.value.evidence ?? [];

    const complaint: Complaint = new Complaint({
      id: String(this.complaintId ?? ''),
      category: this.form.value.category,
      department: this.form.value.department,
      city: this.form.value.city,
      district: this.form.value.district,
      location: '',
      referenceInfo: this.form.value.referenceInfo,
      description: this.form.value.description,
      status: 'Pending',
      priority: priorityValue,
      evidence: evidenceValue,
    });
    //cambiar luego usando un base-api-endpint
    this.http.post('/api/complaints', complaint).subscribe({
      next: () => this.router.navigate(['/complaints']),
      error: err => console.error('Error al enviar la denuncia', err)
    });

    if (this.isEditMode) {
      this.store.updateComplaint(complaint);
    } else {
      this.store.addComplaint(complaint);
    }
    this.router.navigate(['/complaints']).then();
  }

  saveDraft() {
    // Lógica para guardar como borrador
  }
}
