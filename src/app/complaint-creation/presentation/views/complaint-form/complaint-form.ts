import { Component, inject } from '@angular/core';
import {FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ComplaintsStore } from '../../../application/complaints-store';
import {ActivatedRoute, Router} from '@angular/router';
import {Complaint} from '../../../domain/model/complaint.entity';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complaint-form',
  templateUrl: './complaint-form.html',
  styleUrl: './complaint-form.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ComplaintForm {
  private fb = inject(FormBuilder);
  private store = inject(ComplaintsStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  form = this.fb.group({
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    department: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    city: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    district: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    location: new FormControl<string>('', {
      nonNullable: true
    }),
    referenceInfo: new FormControl<string>('', {
      nonNullable: true
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)]
    }),
    evidence: new FormControl<string>('', {
      nonNullable: true
    }),
    priority: new FormControl<string>('Standard', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    anonymous: new FormControl<boolean>(false),
    termsAccepted: new FormControl<boolean>(false, {
      validators: [Validators.requiredTrue]
    })
  });

  isEditMode = false;
  complaintId: string | null = null;

  constructor() {
    this.route.params.subscribe(params => {
      this.complaintId = params['id'] ?? null;
      this.isEditMode = !!this.complaintId;
      if (this.isEditMode) {
        this.loadComplaintForEdit();
      }
    });
  }

  private loadComplaintForEdit(): void {
    const complaint = this.store.getComplaintById(this.complaintId!)();
    if (complaint) {
      const evidenceString = complaint.evidence?.join(', ') || '';

      this.form.patchValue({
        category: complaint.category,
        department: complaint.department,
        city: complaint.city,
        district: complaint.district,
        location: complaint.location,
        referenceInfo: complaint.referenceInfo,
        description: complaint.description,
        evidence: evidenceString,
        priority: complaint.priority,
        anonymous: false,
        termsAccepted: true
      });
    }
  }

  submitComplaint() {
    console.log('Form status:', this.form.status);
    console.log('Form errors:', this.form.errors);
    console.log('Form values:', this.form.value);

    if (this.form.invalid) {
      this.markAllFieldsAsTouched();
      alert('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    try {
      // ✅ Convertir string de evidence a array
      const evidenceArray = this.form.value.evidence
        ? this.form.value.evidence.split(',').map(item => item.trim()).filter(item => item !== '')
        : [];

      // ✅ Crear una instancia de Complaint
      const complaint = new Complaint();

      // ✅ Timeline inicial predefinido
      const initialTimeline = [
        {
          status: 'Complaint registered',
          date: new Date().toISOString(),
          completed: true,
          current: true,
          waitingDecision: false
        },
        {
          status: 'Under review',
          date: '',
          completed: false,
          current: false,
          waitingDecision: false
        },
        {
          status: 'Awaiting response',
          date: '',
          completed: false,
          current: false,
          waitingDecision: false
        },
        {
          status: 'Decision pending',
          date: '2025-10-07T20:19:00',
          completed: false,
          current: false,
          waitingDecision: true
        },
        {
          status: 'Completed',
          date: '',
          completed: false,
          current: false,
          waitingDecision: false
        }
      ];

      // ✅ Asignar los valores del formulario
      Object.assign(complaint, {
        id: this.complaintId || this.generateId(),
        category: this.form.value.category!,
        department: this.form.value.department!,
        city: this.form.value.city!,
        district: this.form.value.district!,
        location: this.form.value.location || `${this.form.value.department}, ${this.form.value.city}, ${this.form.value.district}`,
        referenceInfo: this.form.value.referenceInfo!,
        description: this.form.value.description!,
        status: 'Pending',
        priority: this.form.value.priority! as 'Standard' | 'Urgent' | 'Critical',
        evidence: evidenceArray,
        assignedTo: 'Not assigned',
        updateMessage: '',
        updateDate: new Date().toISOString(),
        timeline: initialTimeline  // 👈 aquí agregamos el timeline predefinido
      });

      console.log('Enviando denuncia:', complaint);

      // ✅ Guardar la denuncia según el modo
      if (this.isEditMode) {
        this.store.updateComplaint(complaint);
      } else {
        this.store.addComplaint(complaint);
      }

      // ✅ Navegar después de guardar
      this.router.navigate(['/complaints']).then(() => {
        alert('Denuncia ' + (this.isEditMode ? 'actualizada' : 'enviada') + ' correctamente ✅');
      });

    } catch (error) {
      console.error('Error al procesar la denuncia:', error);
      alert('Error al procesar la denuncia. Por favor, intente nuevamente.');
    }
  }


  // ✅ ALTERNATIVA: Si la clase Complaint tiene un constructor que acepta parámetros
  private createComplaintInstance(): Complaint {
    const evidenceArray = this.form.value.evidence
      ? this.form.value.evidence.split(',').map(item => item.trim()).filter(item => item !== '')
      : [];

    // Si el constructor de Complaint acepta parámetros, úsalo así:
    const complaint = new Complaint();

    // Asignar propiedades directamente si son públicas
    complaint.id = this.complaintId || this.generateId();
    complaint.category = this.form.value.category!;
    complaint.department = this.form.value.department!;
    complaint.city = this.form.value.city!;
    complaint.district = this.form.value.district!;
    complaint.location = this.form.value.location || `${this.form.value.department}, ${this.form.value.city}, ${this.form.value.district}`;
    complaint.referenceInfo = this.form.value.referenceInfo!;
    complaint.description = this.form.value.description!;
    complaint.status = 'Pending';
    complaint.priority = this.form.value.priority! as 'Standard' | 'Urgent' | 'Critical';
    complaint.evidence = evidenceArray;
    complaint.assignedTo = 'Not assigned';
    complaint.updateMessage = '';
    complaint.updateDate = new Date().toISOString();
    complaint.timeline = [];

    return complaint;
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private generateId(): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return randomNum.toString();
  }

  saveDraft() {
    const draftData = {
      ...this.form.value,
      status: 'Draft' as const,
      savedAt: new Date().toISOString()
    };

    console.log('Guardando borrador:', draftData);
    alert('Borrador guardado correctamente 📝');

    localStorage.setItem('complaintDraft', JSON.stringify(draftData));
  }

  getFormErrors(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.errors) {
        console.log(`Campo ${key}:`, control.errors);
      }
    });
  }
}
