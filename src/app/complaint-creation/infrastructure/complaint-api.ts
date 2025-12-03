import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, map, catchError, of} from 'rxjs';
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


  getComplaints(): Observable<Complaint[]> {
    return this.http
      .get<any>(`${this.baseUrl}${this.endpoint}`)
      .pipe(
        map(response => {
          // Soporta respuesta como array o como { complaints: [...] }
          if (Array.isArray(response)) {
            return response.map((resource: ComplaintResource) => ComplaintAssembler.toEntityFromResource(resource));
          }
          if (response && Array.isArray(response.complaints)) {
            return response.complaints.map((resource: ComplaintResource) => ComplaintAssembler.toEntityFromResource(resource));
          }
          // Si viene un solo recurso
          if (response && typeof response === 'object') {
            return [ComplaintAssembler.toEntityFromResource(response as ComplaintResource)];
          }
          return [];
        }),
        catchError(err => {
          // Devuelve array vacío en caso de error para que el store lo maneje
          console.error('Error fetching complaints', err);
          return of([] as Complaint[]);
        })
      );
  }

  getAllComplaints(): Observable<{ status: string; complaints: Complaint[] }> {
    return this.http.get<any>(`${this.baseUrl}${this.endpoint}`)
      .pipe(
        map((response: any) => {
          if (Array.isArray(response)) {
            return {
              status: 'success',
              complaints: response.map((r: ComplaintResource) => ComplaintAssembler.toEntityFromResource(r))
            };
          }
          else if (response.complaints) {
            return {
              status: response.status || 'success',
              complaints: response.complaints.map((r: ComplaintResource) => ComplaintAssembler.toEntityFromResource(r))
            };
          }
          else {
            return {
              status: 'success',
              complaints: [ComplaintAssembler.toEntityFromResource(response as ComplaintResource)]
            };
          }
        }),
        catchError(error => {
          console.error('Error fetching all complaints', error);
          return of({
            status: 'error',
            complaints: []
          });
        })
      );
  }


  createComplaint(complaint: Complaint): Observable<Complaint> {
    const resource = ComplaintAssembler.toResourceFromEntity(complaint);
    return this.http
      .post<ComplaintResource>(`${this.baseUrl}${this.endpoint}`, resource)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }


  getComplaintById(id: string): Observable<Complaint> {
    return this.http
      .get<ComplaintResource>(`${this.baseUrl}${this.endpoint}/${id}`)
      .pipe(
        map(resource => ComplaintAssembler.toEntityFromResource(resource)),
        catchError(error => {
          console.error(`Error fetching complaint ${id}`, error);
          throw error;
        })
      );
  }


  updateComplaint(complaint: Complaint): Observable<Complaint> {
    const resource = ComplaintAssembler.toResourceFromEntity(complaint);
    return this.http
      .put<ComplaintResource>(`${this.baseUrl}${this.endpoint}/${complaint.id}`, resource)
      .pipe(map(updatedResource => ComplaintAssembler.toEntityFromResource(updatedResource)));
  }

  /**
   * Actualiza solo el estado de la denuncia (PATCH /{id}/status)
   */
  updateComplaintStatus(id: string, status: string): Observable<Complaint> {
    return this.http
      .patch<ComplaintResource>(`${this.baseUrl}${this.endpoint}/${id}/status`, { status })
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  getComplaintsByStatus(status: string): Observable<Complaint[]> {
    return this.http
      .get<ComplaintResource[]>(`${this.baseUrl}${this.endpoint}/status/${encodeURIComponent(status)}`)
      .pipe(map(resources => resources.map(resource => ComplaintAssembler.toEntityFromResource(resource))));
  }

  getComplaintsByLocation(department: string, city: string): Observable<Complaint[]> {
    return this.http
      .get<ComplaintResource[]>(`${this.baseUrl}${this.endpoint}/department/${encodeURIComponent(department)}/city/${encodeURIComponent(city)}`)
      .pipe(map(resources => resources.map(resource => ComplaintAssembler.toEntityFromResource(resource))));
  }


  deleteComplaint(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.endpoint}/${id}`);
  }
}
