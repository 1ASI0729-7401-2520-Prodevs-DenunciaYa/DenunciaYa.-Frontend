import { Injectable, Signal, signal, computed } from '@angular/core';
import {AssignmentApiService} from '../infrastructure/assignment-api';
import {ResponsibleCreateStore} from './responsibleCreate.store';

export interface Assignment {
  id: string;
  complaintId: string;
  responsibleId: string;
  assignedDate: string;
  assignedBy: string;
  status: 'active' | 'reassigned' | 'removed';
}

@Injectable({
  providedIn: 'root'
})
export class AssignmentStore {
  private readonly assignmentsSignal = signal<Assignment[]>([]);
  readonly assignments = this.assignmentsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly activeAssignments = computed(() =>
    this.assignments().filter(a => a.status === 'active')
  );

  constructor(private api: AssignmentApiService) {
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getAssignments().subscribe({
      next: data => {
        this.assignmentsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set('Error al cargar asignaciones');
        this.loadingSignal.set(false);
      }
    });
  }

  assignComplaint(complaintId: string, responsibleId: string, assignedBy: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const assignment: Omit<Assignment, 'id'> = {
      complaintId,
      responsibleId,
      assignedDate: new Date().toISOString(),
      assignedBy,
      status: 'active'
    };

    this.api.createAssignment(assignment).subscribe({
      next: newAssignment => {
        this.assignmentsSignal.update(list => [...list, newAssignment]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set('Error al asignar denuncia');
        this.loadingSignal.set(false);
      }
    });
  }

  reassignComplaint(complaintId: string, newResponsibleId: string, assignedBy: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Marcar la asignación anterior como reassigned
    this.assignmentsSignal.update(assignments =>
      assignments.map(a =>
        a.complaintId === complaintId && a.status === 'active'
          ? { ...a, status: 'reassigned' }
          : a
      )
    );

    // Crear nueva asignación
    const newAssignment: Omit<Assignment, 'id'> = {
      complaintId,
      responsibleId: newResponsibleId,
      assignedDate: new Date().toISOString(),
      assignedBy,
      status: 'active'
    };

    this.api.createAssignment(newAssignment).subscribe({
      next: assignment => {
        this.assignmentsSignal.update(list => [...list, assignment]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set('Error al reasignar denuncia');
        this.loadingSignal.set(false);
      }
    });
  }

  removeAssignment(complaintId: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.assignmentsSignal.update(assignments =>
      assignments.map(a =>
        a.complaintId === complaintId && a.status === 'active'
          ? { ...a, status: 'removed' }
          : a
      )
    );

    this.api.updateAssignmentStatus(complaintId, 'removed').subscribe({
      next: () => {
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set('Error al eliminar asignación');
        this.loadingSignal.set(false);
      }
    });
  }

  getAssignmentByComplaintId(complaintId: string): Assignment | undefined {
    return this.activeAssignments().find(a => a.complaintId === complaintId);
  }

  getAssignmentsByResponsibleId(responsibleId: string): Assignment[] {
    return this.activeAssignments().filter(a => a.responsibleId === responsibleId);
  }
  notifyResponsiblesStore(responsibleStore: ResponsibleCreateStore) {
    this.assignments().forEach(a => {
      const responsible = responsibleStore.responsibles().find(r => r.id === a.responsibleId);
      if (responsible && !responsible.assignedComplaints.includes(a.complaintId)) {
        responsible.addComplaint(a.complaintId);
        responsibleStore.updateResponsibleInStore(responsible);
      }
    });
  }
}
