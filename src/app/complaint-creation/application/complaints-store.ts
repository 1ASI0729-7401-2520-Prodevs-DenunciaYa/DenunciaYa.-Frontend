import { Injectable, signal, computed, Signal } from '@angular/core';
import { Complaint } from '../domain/model/complaint.entity';
import { ComplaintsApiService } from '../infrastructure/complaint-api';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsStore {
  private readonly complaintsSignal = signal<Complaint[]>([]);
  readonly complaints = this.complaintsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly complaintCount = computed(() => this.complaints().length);

  constructor(private api: ComplaintsApiService) {
    this.loadAll();
  }

  loadAll(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getComplaints().pipe(retry(2)).subscribe({
      next: data => {
        console.log('Denuncias recibidas:', data); // quitar luego
        this.complaintsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set('Error al cargar denuncias');
        this.loadingSignal.set(false);
      }
    });
  }

  getComplaintById(id: number | string | null | undefined): Signal<Complaint | undefined> {
    return computed(() => id ? this.complaints().find(c => c.id === id) : undefined);
  }

  addComplaint(complaint: Complaint) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.createComplaint(complaint).pipe(retry(2)).subscribe({
      next: newComplaint => {
        this.complaintsSignal.update(list => [...list, newComplaint]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set('Error al agregar denuncia');
        this.loadingSignal.set(false);
      }
    });
  }

  updateComplaint(complaint: Complaint) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.updateComplaint(complaint).pipe(retry(2)).subscribe({
      next: updatedComplaint => {
        this.complaintsSignal.update(list =>
          list.map(c => c.id === updatedComplaint.id ? updatedComplaint : c)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set('Error al actualizar denuncia');
        this.loadingSignal.set(false);
      }
    });
  }

  deleteComplaint(id: string) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.deleteComplaint(id).pipe(retry(2)).subscribe({
      next: () => {
        this.complaintsSignal.update(list => list.filter(c => c.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set('Error al eliminar denuncia');
        this.loadingSignal.set(false);
      }
    });
  }
}
