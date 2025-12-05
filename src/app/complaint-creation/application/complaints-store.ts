import { Injectable, signal, computed, Signal } from '@angular/core';
import { Complaint } from '../domain/model/complaint.entity';
import { ComplaintsApiService } from '../infrastructure/complaint-api';
import { retry } from 'rxjs';
import { AuthService } from '../../public/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
/**
 * @class ComplaintsStore
 * @summary State management store for complaints.
 * @description This store manages the state of complaints including loading, error handling,
 * and CRUD operations by interacting with the ComplaintsApiService.
 * @method loadAll Loads all complaints from the API.
 * @method getComplaintById Retrieves a complaint by its ID.
 * @method addComplaint Adds a new complaint to the store and API.
 * @method updateComplaint Updates an existing complaint in the store and API.
 * @method deleteComplaint Deletes a complaint from the store and API.
 */
export class ComplaintsStore {
  private readonly complaintsSignal = signal<Complaint[]>([]);
  readonly complaints = this.complaintsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly complaintCount = computed(() => this.complaints().length);

  constructor(private api: ComplaintsApiService, private authService: AuthService) {
    this.loadAll();

    this.authService.token$.pipe(takeUntilDestroyed()).subscribe(token => {
      if (token) {
        this.loadAll();
      }
    });
  }

  /**
   * @method loadAll
   * @summary Loads all complaints from the API.
   * @description Fetches complaints and updates the store state accordingly.
   */
  loadAll(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.getComplaints().pipe(retry(2)).subscribe({
      next: data => {
        this.complaintsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => {
        const msg = err?.status === 401 || err?.status === 403
          ? 'Dont have permission to access complaints'
          : 'Error loading complaints';
        this.errorSignal.set(msg);
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * @method getComplaintById
   * @summary Retrieves a complaint by its ID.
   * @description Returns a signal that emits the complaint with the specified ID.
   * @param id - The ID of the complaint to retrieve.
   */
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
        this.errorSignal.set('Error to create complaint');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * @method updateComplaint
   * @summary Updates an existing complaint.
   * @description Sends the updated complaint to the API and updates the store state.
   * @param complaint - The complaint object with updated data.
   */
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
        this.errorSignal.set('Error to update complaint');
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
        this.errorSignal.set('Error to delete complaint');
        this.loadingSignal.set(false);
      }
    });
  }
}
