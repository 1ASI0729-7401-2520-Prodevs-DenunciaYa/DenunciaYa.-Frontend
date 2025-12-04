import { Injectable, signal, computed, Signal } from '@angular/core';
import { Complaint } from '../domain/model/complaint.entity';
import { ComplaintsApiService } from '../infrastructure/complaint-api';
import { retry } from 'rxjs';
import { AuthService } from '../../public/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  constructor(private api: ComplaintsApiService, private authService: AuthService) {
    // Cargar siempre al iniciar. El backend actual no requiere autenticación.
    this.loadAll();

    // Si en el futuro hay token, se puede refrescar la data al establecerse.
    this.authService.token$.pipe(takeUntilDestroyed()).subscribe(token => {
      if (token) {
        this.loadAll();
      }
    });
  }

  loadAll(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // No bloquear por token: el backend público no lo requiere.
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   this.errorSignal.set('No autenticado: inicia sesión para ver denuncias.');
    //   this.loadingSignal.set(false);
    //   return;
    // }

    this.api.getComplaints().pipe(retry(2)).subscribe({
      next: data => {
        this.complaintsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => {
        const msg = err?.status === 401 || err?.status === 403
          ? 'No autorizado: verifica tu token de sesión.'
          : 'Error al cargar denuncias';
        this.errorSignal.set(msg);
        this.loadingSignal.set(false);
      }
    });
  }

  getComplaintById(id: string  | null | undefined): Signal<Complaint | undefined> {
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
        this.updateComplaintInStore(complaint);
        this.loadingSignal.set(false);
      }
    });
  }

  updateComplaintInStore(complaint: Complaint): void {
    this.complaintsSignal.update(list =>
      list.map(c => c.id === complaint.id ? complaint : c)
    );
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
