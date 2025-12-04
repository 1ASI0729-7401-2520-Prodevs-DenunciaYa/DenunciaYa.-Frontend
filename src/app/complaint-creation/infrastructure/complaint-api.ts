import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, map, catchError, of, tap} from 'rxjs';
import { environment } from '../../../environments/environment';
import { Complaint } from '../domain/model/complaint.entity';
import { ComplaintResource } from './complaint-response';
import { ComplaintAssembler } from './complaint-assembler';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsApiService {
  private readonly baseUrl = environment.platformProviderApiBaseUrl;
  private readonly endpoint = environment.platformProviderComplaintsEndpointPath;

  constructor(private http: HttpClient) {}

  private fullUrl(path: string = ''): string {
    return `${this.baseUrl}${this.endpoint}${path}`;
  }

  private authHeaders(): { headers?: HttpHeaders } {
    const token = localStorage.getItem('token');
    const isValidToken = typeof token === 'string' && token !== 'null' && token !== 'undefined' && token.split('.').length === 3;
    if (isValidToken && token) {
      return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    }
    return {};
  }

  getComplaints(): Observable<Complaint[]> {
    const url = this.fullUrl('');
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] GET', url);
    return this.http
      .get<any>(url, opts)
      .pipe(
        tap(resp => console.debug('[ComplaintsApiService] getComplaints raw response type:', Array.isArray(resp) ? 'array' : typeof resp)),
        map(response => {
          if (Array.isArray(response)) {
            const entities = response.map((resource: ComplaintResource) => ComplaintAssembler.toEntityFromResource(resource));
            console.debug('[ComplaintsApiService] mapped complaints count:', entities.length);
            return entities;
          }
          if (response && Array.isArray(response.complaints)) {
            const entities = response.complaints.map((resource: ComplaintResource) => ComplaintAssembler.toEntityFromResource(resource));
            console.debug('[ComplaintsApiService] mapped complaints count (wrapped):', entities.length);
            return entities;
          }
          if (response && typeof response === 'object') {
            const one = ComplaintAssembler.toEntityFromResource(response as ComplaintResource);
            console.debug('[ComplaintsApiService] single complaint mapped with id:', one.id);
            return [one];
          }
          console.warn('[ComplaintsApiService] unexpected response format, returning empty list');
          return [];
        }),
        catchError(err => {
          console.error('[ComplaintsApiService] Error fetching complaints', err);
          return of([] as Complaint[]);
        })
      );
  }

  getAllComplaints(): Observable<{ status: string; complaints: Complaint[] }> {
    const url = this.fullUrl('');
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] GET all', url);
    return this.http.get<any>(url, opts)
      .pipe(
        map((response: any) => {
          try {
            if (!response) {
              console.warn('[ComplaintsApiService] getAllComplaints: null/undefined response');
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
            console.warn('[ComplaintsApiService] getAllComplaints: unexpected format, returning empty list');
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

  createComplaint(complaint: Complaint): Observable<Complaint> {
    const resource = ComplaintAssembler.toResourceFromEntity(complaint);
    const url = this.fullUrl('');
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] POST', url, 'payload id:', resource.id);
    return this.http
      .post<ComplaintResource>(url, resource, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  getComplaintById(id: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(id)}`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] GET by id', url);
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

  updateComplaint(complaint: Complaint): Observable<Complaint> {
    const resource = ComplaintAssembler.toResourceFromEntity(complaint);
    // Verifica el ID antes de construir la URL
    console.log('[ComplaintsApiService] updateComplaint - complaint.id:', complaint.id);
    console.log('[ComplaintsApiService] updateComplaint - resource.id:', resource.id);

    const url = this.fullUrl(`/${encodeURIComponent(complaint.id)}`);
    console.log('[ComplaintsApiService] PUT URL:', url);

    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] PUT', url);

    return this.http
      .put<ComplaintResource>(url, resource, opts)
      .pipe(map(updatedResource => ComplaintAssembler.toEntityFromResource(updatedResource)));
  }

  updateComplaintStatus(id: string, status: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(id)}/status`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] PATCH status', url, 'status:', status);
    return this.http
      .patch<ComplaintResource>(url, { status }, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  getComplaintsByStatus(status: string): Observable<Complaint[]> {
    const url = this.fullUrl(`/status/${encodeURIComponent(status)}`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] GET by status', url);
    return this.http
      .get<ComplaintResource[]>(url, opts)
      .pipe(map(resources => resources.map(resource => ComplaintAssembler.toEntityFromResource(resource))));
  }

  getComplaintsByLocation(department: string, city: string): Observable<Complaint[]> {
    const url = this.fullUrl(`/department/${encodeURIComponent(department)}/city/${encodeURIComponent(city)}`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] GET by location', url);
    return this.http
      .get<ComplaintResource[]>(url, opts)
      .pipe(map(resources => resources.map(resource => ComplaintAssembler.toEntityFromResource(resource))));
  }

  deleteComplaint(id: string): Observable<void> {
    const url = this.fullUrl(`/${encodeURIComponent(id)}`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] DELETE', url);
    return this.http.delete<void>(url, opts);
  }

  /**
   * Timeline operations
   */
  updateTimelineItem(complaintId: string, timelineItemId: number, payload: Partial<{ status: string; updateMessage: string; completed: boolean; current: boolean; waitingDecision: boolean }>): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/${encodeURIComponent(String(timelineItemId))}`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] PUT timeline item', url, 'payload:', payload);
    return this.http
      .put<ComplaintResource>(url, payload, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  rejectTimelineItem(complaintId: string, timelineItemId: number, updateMessage?: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/${encodeURIComponent(String(timelineItemId))}/reject`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] PUT reject timeline item', url);
    return this.http
      .put<ComplaintResource>(url, { updateMessage }, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  acceptTimelineItem(complaintId: string, timelineItemId: number, updateMessage?: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/${encodeURIComponent(String(timelineItemId))}/accept`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] PUT accept timeline item', url);
    return this.http
      .put<ComplaintResource>(url, { updateMessage }, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  rejectDecision(complaintId: string, updateMessage?: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/reject`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] PATCH reject decision', url);
    return this.http
      .patch<ComplaintResource>(url, { updateMessage }, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  updateSpecificTimelineItem(complaintId: string, payload: { timelineItemId: number; status?: string; updateMessage?: string; completed?: boolean; current?: boolean; waitingDecision?: boolean }): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/item`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] PATCH specific timeline item', url, 'payload:', payload);
    return this.http
      .patch<ComplaintResource>(url, payload, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  advanceTimeline(complaintId: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/advance`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] PATCH advance timeline', url);

    return this.http
      .patch<ComplaintResource>(url, {}, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  acceptDecision(complaintId: string, updateMessage?: string): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/accept`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] PATCH accept decision', url);
    return this.http
      .patch<ComplaintResource>(url, { updateMessage }, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  updateTimelineItemById(complaintId: string, timelineItemId: number, payload: { completed?: boolean; current?: boolean; waitingDecision?: boolean; status?: string; updateMessage?: string }): Observable<Complaint> {
    const url = this.fullUrl(`/${encodeURIComponent(complaintId)}/timeline/${encodeURIComponent(String(timelineItemId))}`);
    const opts = this.authHeaders();
    console.debug('[ComplaintsApiService] PUT timeline item by id', url, 'payload:', payload);
    return this.http
      .put<ComplaintResource>(url, { timelineItemId, ...payload }, opts)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }


}
