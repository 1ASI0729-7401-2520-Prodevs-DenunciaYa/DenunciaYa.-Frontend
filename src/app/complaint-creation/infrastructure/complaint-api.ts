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
          else if (response.complaints) {
            return {
              status: response.status || 'success',
              complaints: response.complaints
            };
          }
          else {
            return {
              status: 'success',
              complaints: [response]
            };
          }
        }),
        catchError(error => {
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
        catchError(error => {
          throw error;
        }),
        map(resource => ComplaintAssembler.toEntityFromResource(resource))
      );
  }


  updateComplaint(complaint: Complaint): Observable<Complaint> {
    const resource = ComplaintAssembler.toResourceFromEntity(complaint);
    return this.http
      .put<ComplaintResource>(`${this.baseUrl}${this.endpoint}/${complaint.id}`, resource)
      .pipe(map(updatedResource => ComplaintAssembler.toEntityFromResource(updatedResource)));
  }


  deleteComplaint(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.endpoint}/${id}`);
  }
}
