import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, map, tap, catchError, of} from 'rxjs';
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

  /**
   * Obtiene todas las denuncias
   */
  getComplaints(): Observable<Complaint[]> {
    return this.http
      .get<ComplaintResource[]>(`${this.baseUrl}${this.endpoint}`)
      .pipe(map(resources => resources.map(resource => ComplaintAssembler.toEntityFromResource(resource))));
  }

  getAllComplaints(): Observable<{ status: string; complaints: Complaint[] }> {
    return this.http.get<any>(`${this.baseUrl}${this.endpoint}`)
      .pipe(
        tap(response => {
        }),
        map((response: any) => {
          if (Array.isArray(response)) {
            return {
              status: 'success',
              complaints: response
            };
          }
          // Si tiene la estructura esperada
          else if (response.complaints) {
            return {
              status: response.status || 'success',
              complaints: response.complaints
            };
          }
          // Si es un objeto con datos de complaint
          else {
            return {
              status: 'success',
              complaints: [response] // convierte a array
            };
          }
        }),
        catchError(error => {
          console.error('Error fetching complaints:', error);
          return of({
            status: 'error',
            complaints: []
          });
        })
      );
  }

  /**
   * Crea una nueva denuncia
   */
  createComplaint(complaint: Complaint): Observable<Complaint> {
    const resource = ComplaintAssembler.toResourceFromEntity(complaint);
    return this.http
      .post<ComplaintResource>(`${this.baseUrl}${this.endpoint}`, resource)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  /**
   * Obtiene una denuncia específica por ID
   */
  getComplaintById(id: string): Observable<Complaint> {
    return this.http
      .get<ComplaintResource>(`${this.baseUrl}${this.endpoint}/${id}`)
      .pipe(
        catchError(error => {
          console.error('API Error for ID:', id, error);
          throw error;
        }),
        map(resource => ComplaintAssembler.toEntityFromResource(resource))
      );
  }

  /**
   * Actualiza una denuncia existente
   */
  updateComplaint(complaint: Complaint): Observable<Complaint> {
    const resource = ComplaintAssembler.toResourceFromEntity(complaint);
    return this.http
      .put<ComplaintResource>(`${this.baseUrl}${this.endpoint}/${complaint.id}`, resource)
      .pipe(map(updatedResource => ComplaintAssembler.toEntityFromResource(updatedResource)));
  }

  /**
   * Elimina una denuncia por ID
   */
  deleteComplaint(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.endpoint}/${id}`);
  }
}
