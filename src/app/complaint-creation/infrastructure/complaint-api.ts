import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Complaint } from '../domain/model/complaint.entity';
import { ComplaintsResponse, ComplaintResource } from './complaint-response';
import { ComplaintAssembler } from './complaint-assembler';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsApiService {
  private baseUrl = environment.apiBaseUrl || 'http://localhost:3000';
  private endpoint = '/complaints';

  constructor(private http: HttpClient) {}

  getComplaints(): Observable<Complaint[]> {
    return this.http.get<ComplaintResource[]>(`${this.baseUrl}${this.endpoint}`)
      .pipe(map(resources => resources.map(resource => ComplaintAssembler.toEntityFromResource(resource))));
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
