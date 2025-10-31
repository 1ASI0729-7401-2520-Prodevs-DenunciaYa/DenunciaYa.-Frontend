import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Assignment } from '../application/assignment.store';

/**
 * @class AssignmentApiService
 * @summary Service for managing assignments through API calls, including fetching, creating, updating, and deleting assignments.
 * @constructor @param {HttpClient} http - The HTTP client for making API requests.
 * @method getAssignments - Fetches all assignments.
 * @method createAssignment - Creates a new assignment.
 * @method updateAssignmentStatus - Updates the status of an assignment based on complaint ID.
 * @method deleteAssignment - Deletes an assignment by its ID.
 */
@Injectable({
  providedIn: 'root'
})
export class AssignmentApiService {
  private readonly baseUrl = environment.platformProviderApiBaseUrl;
  private readonly endpoint = environment.platformProviderAssignmentsEndpointPath;
  constructor(private http: HttpClient) {}

  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.baseUrl}${this.endpoint}`);
  }
  createAssignment(assignment: Omit<Assignment, 'id'>): Observable<Assignment> {
    const newAssignment = {
      ...assignment,
      id: `assign-${Date.now()}`
    };
    return this.http.post<Assignment>(`${this.baseUrl}${this.endpoint}`, newAssignment);
  }

  updateAssignmentStatus(complaintId: string, status: Assignment['status']): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}${this.endpoint}/complaint/${complaintId}`, { status });
  }

  deleteAssignment(assignmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.endpoint}/${assignmentId}`);
  }
}
