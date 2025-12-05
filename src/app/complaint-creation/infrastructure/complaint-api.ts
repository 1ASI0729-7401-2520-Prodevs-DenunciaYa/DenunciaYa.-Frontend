import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, map, catchError, of, tap} from 'rxjs';
import { environment } from '../../../environments/environment';
import { Complaint } from '../domain/model/complaint.entity';
import { ComplaintResource } from './complaint-response';
import { ComplaintAssembler } from './complaint-assembler';

/** Service for interacting with the Complaints API.
 * Provides methods to perform CRUD operations on complaints.
 * Handles authentication headers and error handling.
 * @class ComplaintsApiService
 * @method getComplaints - Fetch all complaints.
 * @method getComplaintById - Fetch a complaint by its ID.
 * @method createComplaint - Create a new complaint.
 * @method updateComplaint - Update an existing complaint.
 * @method deleteComplaint - Delete a complaint by its ID.
 * @method updateComplaintStatus - Update the status of a complaint.
 * @method getComplaintsByStatus - Fetch complaints filtered by status.
 * @method getComplaintsByLocation - Fetch complaints filtered by location.
 * @method updateTimelineItem - Update a timeline item of a complaint.
 * @method rejectTimelineItem - Reject a timeline item of a complaint.
 * @method acceptTimelineItem - Accept a timeline item of a complaint.
 * @method rejectDecision - Reject the decision on a complaint.
 * @method updateSpecificTimelineItem - Update specific fields of a timeline item.
 * @method advanceTimeline - Advance the timeline of a complaint.
 * @method acceptDecision - Accept the decision on a complaint.
 * @method updateTimelineItemById - Update a timeline item by its ID.
 * @method updateTimelineItemStatus - Update the status of a timeline item.
 */
@Injectable({
  providedIn: 'root'
})
export class ComplaintsApiService {
  private readonly baseUrl = environment.platformProviderApiBaseUrl;
  private readonly endpoint = environment.platformProviderComplaintsEndpointPath;

  /**
   * Creates an instance of ComplaintsApiService.
   * @param http - The HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /** Constructs the full URL for API requests.
   * @param path - The specific path to append to the endpoint.
   * @returns The full URL as a string.
   */
  private fullUrl(path: string = ''): string {
    return `${this.baseUrl}${this.endpoint}${path}`;
  }

  /** Generates authentication headers for API requests.
   * @returns An object containing the headers, or an empty object if no valid token is found.
   */
  private authHeaders(): { headers?: HttpHeaders } {
    const token = localStorage.getItem('token');
    const isValidToken = typeof token === 'string' && token !== 'null' && token !== 'undefined' && token.split('.').length === 3;
    if (isValidToken && token) {
      return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    }
    return {};
  }

  /** Fetches all complaints from the API.
   * @returns An Observable emitting an array of Complaint entities.
   */
  getComplaints(): Observable<Complaint[]> {
    const url = this.fullUrl('');
    const opts = this.authHeaders();
    return this.http
      .get<any>(url, opts)
      .pipe(
        map(response => {
          if (Array.isArray(response)) {
            const entities = response.map((resource: ComplaintResource) => ComplaintAssembler.toEntityFromResource(resource));
            return entities;
          }
          if (response && Array.isArray(response.complaints)) {
            const entities = response.complaints.map((resource: ComplaintResource) => ComplaintAssembler.toEntityFromResource(resource));
            return entities;
          }
          if (response && typeof response === 'object') {
            const one = ComplaintAssembler.toEntityFromResource(response as ComplaintResource);
            return [one];
          }
          return [];
        }),
        catchError(err => {
          console.error('[ComplaintsApiService] Error fetching complaints', err);
          return of([] as Complaint[]);
        })
      );
  }
/** Fetches all complaints from the API with status and error handling.
   * @returns An Observable emitting an object containing status and an array of Complaint entities.
   */
  getAllComplaints(): Observable<{ status: string; complaints: Complaint[] }> {
    const url = this.fullUrl('');
    const opts = this.authHeaders();
    return this.http.get<any>(url, opts)
      .pipe(
        map((response: any) => {
          try {
            if (!response) {
              return { status: 'success', complaints: [] };
            }
            if (Array.isArray(response)) {
              return {
                status: 'success',
                complaints: response.map((r: ComplaintResource) => ComplaintAssembler.toEntityFromResource(r))
              };
            }
            if (Array.isArray(response.complaints)) {
              return {
                status: response.status || 'success',
                complaints: response.complaints.map((r: ComplaintResource) => ComplaintAssembler.toEntityFromResource(r))
              };
            }
            if (typeof response === 'object' && response.id) {
              return {
                status: 'success',
                complaints: [ComplaintAssembler.toEntityFromResource(response as ComplaintResource)]
              };
            }
            return { status: 'success', complaints: [] };
          } catch (e) {
            console.error('[ComplaintsApiService] getAllComplaints mapper error:', e);
            return { status: 'error', complaints: [] };
          }
        }),
        catchError(error => {
          console.error('[ComplaintsApiService] Error fetching all complaints', error);
          return of({
            status: 'error',
            complaints: []
          });
        })
      );
  }
  /** Creates a new complaint via the API.
   * @param complaint - The Complaint entity to create.
   * @returns An Observable emitting the created Complaint entity.
   */
  createComplaint(complaint: Complaint): Observable<Complaint> {
    const resource = ComplaintAssembler.toResourceFromEntity(complaint);
    const url = this.fullUrl('');
    const opts = this.authHeaders();
    return this.http
      .post<ComplaintResource>(url, resource, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }
/** Fetches a complaint by its ID from the API.
   * @param id - The ID of the complaint to fetch.
   * @returns An Observable emitting the Complaint entity.
   */
  getComplaintById(id: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(id)}`);
    const opts = this.authHeaders();
    return this.http
      .get<ComplaintResource>(url, opts)
      .pipe(
        map(resource => ComplaintAssembler.toEntityFromResource(resource)),
        catchError(error => {
          console.error(`[ComplaintsApiService] Error fetching complaint ${id}`, error);
          throw error;
        })
      );
  }

  /** Updates an existing complaint via the API.
   * @param complaint - The Complaint entity to update.
   * @returns An Observable emitting the updated Complaint entity.
   */
  updateComplaint(complaint: Complaint): Observable<Complaint> {
    const resource = ComplaintAssembler.toResourceFromEntity(complaint);

    const url = this.fullUrl(`/${encodeURIComponent(complaint.id)}`);

    const opts = this.authHeaders();

    return this.http
      .put<ComplaintResource>(url, resource, opts)
      .pipe(map(updatedResource => ComplaintAssembler.toEntityFromResource(updatedResource)));
  }

  /** Updates the status of a complaint via the API.
   * @param id - The ID of the complaint to update.
   * @param status - The new status to set.
   * @returns An Observable emitting the updated Complaint entity.
   */
  updateComplaintStatus(id: string, status: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(id)}/status`);
    const opts = this.authHeaders();
    return this.http
      .patch<ComplaintResource>(url, { status }, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  /** Fetches complaints filtered by status from the API.
   * @param status - The status to filter complaints by.
   * @returns An Observable emitting an array of Complaint entities.
   */
  getComplaintsByStatus(status: string): Observable<Complaint[]> {
    const url = this.fullUrl(`/status/${encodeURIComponent(status)}`);
    const opts = this.authHeaders();
    return this.http
      .get<ComplaintResource[]>(url, opts)
      .pipe(map(resources => resources.map(resource => ComplaintAssembler.toEntityFromResource(resource))));
  }

  /** Fetches complaints filtered by location from the API.
   * @param department - The department to filter complaints by.
   * @param city - The city to filter complaints by.
   * @returns An Observable emitting an array of Complaint entities.
   */
  getComplaintsByLocation(department: string, city: string): Observable<Complaint[]> {
    const url = this.fullUrl(`/department/${encodeURIComponent(department)}/city/${encodeURIComponent(city)}`);
    const opts = this.authHeaders();
    return this.http
      .get<ComplaintResource[]>(url, opts)
      .pipe(map(resources => resources.map(resource => ComplaintAssembler.toEntityFromResource(resource))));
  }
/** Deletes a complaint by its ID via the API.
   * @param id - The ID of the complaint to delete.
   * @returns An Observable emitting void upon successful deletion.
   */
  deleteComplaint(id: string): Observable<void> {
    const url = this.fullUrl(`/${encodeURIComponent(id)}`);
    const opts = this.authHeaders();
    return this.http.delete<void>(url, opts);
  }

/** Updates a timeline item of a complaint via the API.
   * @param complaintId - The ID of the complaint.
   * @param timelineItemId - The ID of the timeline item to update.
   * @param payload - The partial data to update the timeline item with.
   * @returns An Observable emitting the updated Complaint entity.
   */
  updateTimelineItem(complaintId: string, timelineItemId: number, payload: Partial<{ status: string; updateMessage: string; completed: boolean; current: boolean; waitingDecision: boolean }>): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/${encodeURIComponent(String(timelineItemId))}`);
    const opts = this.authHeaders();
    return this.http
      .put<ComplaintResource>(url, payload, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }
/** Rejects a timeline item of a complaint via the API.
   * @param complaintId - The ID of the complaint.
   * @param timelineItemId - The ID of the timeline item to reject.
   * @param updateMessage - An optional update message.
   * @returns An Observable emitting the updated Complaint entity.
   */
  rejectTimelineItem(complaintId: string, timelineItemId: number, updateMessage?: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/${encodeURIComponent(String(timelineItemId))}/reject`);
    const opts = this.authHeaders();
    return this.http
      .put<ComplaintResource>(url, { updateMessage }, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }
/** Accepts a timeline item of a complaint via the API.
   * @param complaintId - The ID of the complaint.
   * @param timelineItemId - The ID of the timeline item to accept.
   * @param updateMessage - An optional update message.
   * @returns An Observable emitting the updated Complaint entity.
   */
  acceptTimelineItem(complaintId: string, timelineItemId: number, updateMessage?: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/${encodeURIComponent(String(timelineItemId))}/accept`);
    const opts = this.authHeaders();
    return this.http
      .put<ComplaintResource>(url, { updateMessage }, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }
/** Rejects a decision on a complaint via the API.
   * @param complaintId - The ID of the complaint.
   * @param updateMessage - An optional update message.
   * @returns An Observable emitting the updated Complaint entity.
   */
  rejectDecision(complaintId: string, updateMessage?: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/reject`);
    const opts = this.authHeaders();
    return this.http
      .patch<ComplaintResource>(url, { updateMessage }, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }
/** Updates a specific timeline item of a complaint via the API.
   * @param complaintId - The ID of the complaint.
   * @param payload - The fields to update the timeline item with.
   * @returns An Observable emitting the updated Complaint entity.
   */
  updateSpecificTimelineItem(complaintId: string, payload: { timelineItemId: number; status?: string; updateMessage?: string; completed?: boolean; current?: boolean; waitingDecision?: boolean }): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/item`);
    const opts = this.authHeaders();
    return this.http
      .patch<ComplaintResource>(url, payload, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }
/** Advances the timeline of a complaint via the API.
   * @param complaintId - The ID of the complaint.
   * @returns An Observable emitting the updated Complaint entity.
   */
  advanceTimeline(complaintId: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/advance`);
    const opts = this.authHeaders();

    return this.http
      .patch<ComplaintResource>(url, {}, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }
/** Accepts a decision on a complaint via the API.
   * @param complaintId - The ID of the complaint.
   * @param updateMessage - An optional update message.
   * @returns An Observable emitting the updated Complaint entity.
   */
  acceptDecision(complaintId: string, updateMessage?: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/accept`);
    const opts = this.authHeaders();
    return this.http
      .patch<ComplaintResource>(url, { updateMessage }, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }
/** Updates a timeline item of a complaint by its ID via the API.
   * @param complaintId - The ID of the complaint.
   * @param timelineItemId - The ID of the timeline item to update.
   * @param payload - The fields to update the timeline item with.
   * @returns An Observable emitting the updated Complaint entity.
   */
  updateTimelineItemById(complaintId: string, timelineItemId: number, payload: { completed?: boolean; current?: boolean; waitingDecision?: boolean; status?: string; updateMessage?: string }): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/${encodeURIComponent(String(timelineItemId))}`);
    const opts = this.authHeaders();
    return this.http
      .put<ComplaintResource>(url, { timelineItemId, ...payload }, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  /** Updates the status of a timeline item of a complaint via the API.
   * @param complaintId - The ID of the complaint.
   * @param timelineItemId - The ID of the timeline item to update.
   * @param payload - The status fields to update the timeline item with.
   * @returns An Observable emitting the updated Complaint entity.
   */
  updateTimelineItemStatus(complaintId: string, timelineItemId: number,
                           payload: { completed?: boolean, current?: boolean,
                             waitingDecision?: boolean, updateMessage?: string }): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/${encodeURIComponent(String(timelineItemId))}/status`);
    const opts = this.authHeaders();

    return this.http
      .put<ComplaintResource>(url, payload, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }
}
