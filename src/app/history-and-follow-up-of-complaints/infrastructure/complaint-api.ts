import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Complaint } from '../model/domain/complaint.entity';
import { ComplaintsResponse, ComplaintResource } from './complaint-response';
import { ComplaintAssembler } from './complaint-assembler';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsApiService {
  private baseUrl = environment.apiBaseUrl || 'http://localhost:3000';
  private endpoint = '/complaints';

  constructor(private http: HttpClient) {}

  // Método para el Store (retorna Observable<Complaint[]>)
  getComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.baseUrl}${this.endpoint}`)
      .pipe(
        map((complaints: Complaint[]) => {
          console.log('Complaints from API for Store:', complaints);
          return complaints || [];
        }),
        catchError(error => {
          console.error('Error fetching complaints for store:', error);
          return of([]);
        })
      );
  }

  // Método para el componente de métricas (retorna la estructura esperada)
  getAllComplaints(): Observable<{ status: string; complaints: Complaint[] }> {
    return this.http.get<Complaint[]>(`${this.baseUrl}${this.endpoint}`)
      .pipe(
        map((complaints: Complaint[]) => {
          console.log('Complaints from API for Metrics:', complaints);
          return {
            status: 'success',
            complaints: complaints || []
          };
        }),
        catchError(error => {
          console.error('Error fetching complaints for metrics:', error);
          return of({
            status: 'error',
            complaints: []
          });
        })
      );
  }

  getComplaintById(id: string): Observable<Complaint> {
    return this.http.get<ComplaintResource>(`${this.baseUrl}${this.endpoint}/${id}`)
      .pipe(map(resource => ComplaintAssembler.toEntityFromResource(resource)));
  }

  updateComplaint(complaint: Complaint): Observable<Complaint> {
    const resource = ComplaintAssembler.toResourceFromEntity(complaint);
    return this.http.put<ComplaintResource>(`${this.baseUrl}${this.endpoint}/${complaint.id}`, resource)
      .pipe(map(updatedResource => ComplaintAssembler.toEntityFromResource(updatedResource)));
  }

  deleteComplaint(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.endpoint}/${id}`);
  }
}
