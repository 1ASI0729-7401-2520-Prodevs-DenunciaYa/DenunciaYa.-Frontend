import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ComplaintsApiService } from '../infrastructure/complaint-api';
import { Complaint } from '../model/domain/complaint.entity';

@Injectable({
  providedIn: 'root'
})
/**
 * A store service to manage the state of complaints in the application.
 * It uses a BehaviorSubject to hold the current list of complaints and exposes it as an Observable.
 * It provides methods to load complaints from the API and retrieve a complaint by its ID.
 * @class ComplaintsStore
 * @method loadAll - Loads all complaints from the API and updates the store.
 * @method getComplaintById - Retrieves a complaint by its ID
 * @param {string} id - The ID of the complaint to retrieve.
 * @returns {Complaint | undefined} The complaint with the specified ID, or undefined if not found.
 * @author Omar Harold Rivera Ticllacuri
 */
export class ComplaintsStore {
  private readonly _complaints = new BehaviorSubject<Complaint[]>([]);
  readonly complaints$: Observable<Complaint[]> = this._complaints.asObservable();

  constructor(private api: ComplaintsApiService) {}

  loadAll(): void {
    this.api.getComplaints().subscribe({
      next: (data) => {
        console.log('Store: Loaded complaints:', data.length);
        this._complaints.next(data);
      },
      error: (err) => {
        console.error('Failed to load complaints in store:', err);
        this._complaints.next([]); // Set empty array on error
      }
    });
  }

  getComplaintById(id: string): Complaint | undefined {
    return this._complaints.getValue().find(c => c.id === id);
  }

  // Método opcional para obtener el estado actual
  getCurrentComplaints(): Complaint[] {
    return this._complaints.getValue();
  }
}
