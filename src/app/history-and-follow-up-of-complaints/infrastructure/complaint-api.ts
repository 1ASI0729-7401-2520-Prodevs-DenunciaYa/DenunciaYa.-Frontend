import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, map, catchError, tap} from 'rxjs';
import { environment } from '../../../environments/environment';
import { Complaint } from '../model/domain/complaint.entity';
import { ComplaintsResponse, ComplaintResource } from './complaint-response';
import { ComplaintAssembler } from './complaint-assembler';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsApiService {
  private baseUrl = environment.platformProviderApiBaseUrl;
  private endpoint = environment.apiEndpoints.complaints;

  constructor(private http: HttpClient) {}

// En complaint-api.ts
  getComplaints(): Observable<Complaint[]> {
    return this.http.get<any>(`${this.baseUrl}${this.endpoint}`).pipe(
      tap(response => {
        console.log('🔍 RAW API RESPONSE STRUCTURE:', response);
        console.log('📊 Response keys:', Object.keys(response));
        if (Array.isArray(response)) {
          console.log('📋 First complaint item:', response[0]);
          console.log('🔑 First item keys:', response[0] ? Object.keys(response[0]) : 'No items');
        }
      }),
      map(response => {
        let complaintsArray: any[] = [];

        if (Array.isArray(response)) {
          complaintsArray = response;
        } else if (response.complaints && Array.isArray(response.complaints)) {
          complaintsArray = response.complaints;
        } else if (response.data && Array.isArray(response.data)) {
          complaintsArray = response.data;
        } else if (response) {
          complaintsArray = [response];
        }

        console.log('🔄 Processed complaints array:', complaintsArray);

        // Mapear cada item
        const mappedComplaints = complaintsArray.map(item => {
          console.log('📝 Mapping item:', item);
          try {
            const mapped = ComplaintAssembler.toEntityFromResource(item);
            console.log('✅ Successfully mapped:', mapped);
            return mapped;
          } catch (error) {
            console.error('❌ Error mapping item:', error, item);
            return null;
          }
        }).filter(item => item !== null);

        console.log('🎯 Final mapped complaints:', mappedComplaints);
        return mappedComplaints;
      }),
      catchError(error => {
        console.error('🚨 Error in getComplaints:', error);
        return of([]);
      })
    );
  }

  getAllComplaints(): Observable<{ status: string; complaints: Complaint[] }> {
    return this.http.get<any>(`${this.baseUrl}${this.endpoint}`)
      .pipe(
        tap(response => {
          console.log('RAW API RESPONSE:', response);
          console.log('Response type:', typeof response);
          console.log('Is array?:', Array.isArray(response));
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
