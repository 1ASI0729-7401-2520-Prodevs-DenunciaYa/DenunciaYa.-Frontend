import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, map, catchError, of} from 'rxjs';
import { Responsible } from '../domain/model/responsibleCreate.entity';
import {environment} from '../../../environments/environment';
import {ResponsibleAssembler} from '../infrastructure/responsibleCreate.assembler';
import {ResponsibleResource} from '../infrastructure/responsibleCreate.response';

interface CreateResponsibleRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  description: string;
  accessLevel: string;
  position?: string;
  department?: string;
}

@Injectable({ providedIn: 'root' })
export class ResponsibleCreateStore {
  private http = inject(HttpClient);
  private assembler = new ResponsibleAssembler();

  private readonly baseUrl = `${environment.platformProviderApiBaseUrl}/responsibles`;

  private responsiblesSubject = new BehaviorSubject<Responsible[]>([]);
  responsibles$ = this.responsiblesSubject.asObservable();

  constructor() {}

  loadResponsibles(): void {
    console.log('Loading from:', this.baseUrl);
    this.http.get<ResponsibleResource[]>(this.baseUrl)
      .pipe(
        map(resources => {
          console.log('API Response:', resources);
          return resources.map(resource =>
            this.assembler.toEntityFromResource(resource)
          );
        }),
        catchError(error => {
          console.error('HTTP Error loading responsibles:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (responsibles) => {
          console.log('Loaded responsibles:', responsibles);
          this.responsiblesSubject.next(responsibles);
        },
        error: (error) => {
          console.error('Subscription error:', error);
        }
      });
  }

  getResponsibleById(id: string): Observable<Responsible> {
    return this.http.get<ResponsibleResource>(`${this.baseUrl}/${id}`)
      .pipe(
        map(resource => this.assembler.toEntityFromResource(resource))
      );
  }

  addResponsible(responsibleData: Partial<Responsible>): Observable<Responsible> {
    const request: CreateResponsibleRequest = {
      firstName: responsibleData.firstName || '',
      lastName: responsibleData.lastName || '',
      email: responsibleData.email || '',
      phone: responsibleData.phone || '', // <-- Cambiado a phone
      role: responsibleData.role || '',
      description: responsibleData.description || '',
      accessLevel: responsibleData.accessLevel || 'TECNICO',
      position: responsibleData.position || responsibleData.role || '',
      department: responsibleData.department || 'Default Department'
    };

    return this.http.post<ResponsibleResource>(this.baseUrl, request)
      .pipe(
        map(resource => {
          const newResponsible = this.assembler.toEntityFromResource(resource);
          const currentResponsibles = this.responsiblesSubject.value;
          this.responsiblesSubject.next([...currentResponsibles, newResponsible]);
          return newResponsible;
        }),
        catchError(error => {
          console.error('Error creating responsible:', error);
          throw error;
        })
      );
  }

  updateResponsible(id: string, updateData: Partial<Responsible>): Observable<Responsible> {
    const request = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      email: updateData.email,
      phone: updateData.phone,
      role: updateData.role,
      description: updateData.description,
      accessLevel: updateData.accessLevel,
      position: updateData.position,
      department: updateData.department,
      status: updateData.status
    };

    return this.http.put<ResponsibleResource>(`${this.baseUrl}/${id}`, request)
      .pipe(
        map(resource => {
          const updatedResponsible = this.assembler.toEntityFromResource(resource);
          const currentResponsibles = this.responsiblesSubject.value;
          const updatedResponsibles = currentResponsibles.map(r =>
            r.id === id ? updatedResponsible : r
          );
          this.responsiblesSubject.next(updatedResponsibles);
          return updatedResponsible;
        })
      );
  }

  deleteResponsible(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        map(() => {
          const currentResponsibles = this.responsiblesSubject.value;
          const updatedResponsibles = currentResponsibles.filter(r => r.id !== id);
          this.responsiblesSubject.next(updatedResponsibles);
        })
      );
  }
  searchResponsibles(keyword: string): Observable<Responsible[]> {
    // Si no hay keyword, devolver todos los responsables del store
    if (!keyword || keyword.trim() === '') {
      return of(this.responsiblesSubject.value);
    }

    const searchTerm = keyword.toLowerCase().trim();

    // Primero intentar búsqueda local
    const localResults = this.responsiblesSubject.value.filter(responsible => {
      const fullName = responsible.fullName?.toLowerCase() ||
        `${responsible.firstName} ${responsible.lastName}`.toLowerCase();
      return fullName.includes(searchTerm) ||
        responsible.email.toLowerCase().includes(searchTerm) ||
        responsible.role.toLowerCase().includes(searchTerm) ||
        responsible.accessLevel.toLowerCase().includes(searchTerm);
    });

    // Si encontramos resultados locales, devolverlos
    if (localResults.length > 0) {
      return of(localResults);
    }

    // Si no, hacer llamada API
    return this.http.get<ResponsibleResource[]>(`${this.baseUrl}/search`, {
      params: { keyword: searchTerm }
    }).pipe(
      map(resources => resources.map(resource =>
        this.assembler.toEntityFromResource(resource)
      )),
      catchError(() => {
        // Si hay error en la API, devolver array vacío
        return of([]);
      })
    );
  }

  // Método auxiliar para AssignmentStore
  updateResponsibleInStore(responsible: Responsible): void {
    const currentResponsibles = this.responsiblesSubject.value;
    const updatedResponsibles = currentResponsibles.map(r =>
      r.id === responsible.id ? responsible : r
    );
    this.responsiblesSubject.next(updatedResponsibles);
  }

  // Getter para signals (si es necesario)
  responsibles(): Responsible[] {
    return this.responsiblesSubject.value;
  }
}
