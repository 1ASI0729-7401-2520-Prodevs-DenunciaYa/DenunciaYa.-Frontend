import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Assignment } from '../application/assignment.store';

@Injectable({
  providedIn: 'root'
})
export class AssignmentApiService {
  private readonly baseUrl = environment.platformProviderApiBaseUrl;

  constructor(private http: HttpClient) {}

  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.baseUrl}/assignments`);
  }

  createAssignment(assignment: Omit<Assignment, 'id'>): Observable<Assignment> {
    return this.http.post<Assignment>(`${this.baseUrl}/assignments`, assignment);
  }

  updateAssignmentStatus(complaintId: string, status: Assignment['status']): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/assignments/complaint/${complaintId}`,
      { status }
    );
  }

  deleteAssignment(assignmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}assignments/${assignmentId}`);
  }
}
