import { Injectable, signal, computed, Signal } from '@angular/core';
import { Complaint } from '../domain/model/complaint.entity';
import { ComplaintsApiService } from '../infrastructure/complaint-api';
import { retry } from 'rxjs';

/**
 * @class ComplaintsStore
 * @summary Manages the state of complaints including loading, error handling, and CRUD operations.
 * @constructor
 * @param {ComplaintsApiService} api - Service for interacting with the complaints API.
 * @method loadAll - Loads all complaints from the API.
 * @method getComplaintById - Retrieves a complaint by its ID.
 * @param {string | null | undefined} id - The ID of the complaint to retrieve.
 * @return {Signal<Complaint | undefined>} A signal containing the complaint or undefined if not found.
 * @method addComplaint - Adds a new complaint via the API and updates the store.
 * @param {Complaint} complaint - The complaint to add.
 * @method updateComplaint - Updates an existing complaint via the API and updates the store.
 * @param {Complaint} complaint - The complaint to update.
 * @method updateComplaintInStore - Updates a complaint in the store without making an API call.
 * @param {Complaint} complaint - The complaint to update in the store.
 * @method deleteComplaint - Deletes a complaint via the API and updates the store.
 * @param {string} id - The ID of the complaint to delete.
 */
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
        this.complaintsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set('Error al cargar denuncias');
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
