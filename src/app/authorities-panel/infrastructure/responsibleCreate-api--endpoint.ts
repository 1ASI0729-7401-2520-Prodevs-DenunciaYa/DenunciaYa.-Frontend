import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Responsible } from '../domain/model/responsibleCreate.entity';
import { ResponsibleAssembler } from './responsibleCreate.assembler';
import { ResponsibleResource } from './responsibleCreate.response';
import { environment } from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {ResponsibleCreateStore} from '../application/responsibleCreate.store';

@Injectable({ providedIn: 'root' })
export class ResponsibleApiEndpoint {
  // CORREGIDO: Usa la estructura correcta de endpoints
  private readonly baseUrl = `${environment.platformProviderApiBaseUrl}/responsibles`;
  private assembler = new ResponsibleAssembler();
  private readonly store = inject(ResponsibleCreateStore);

  constructor(private http: HttpClient) {}

  getAll(): Observable<Responsible[]> {
    return this.http.get<ResponsibleResource[]>(this.baseUrl)
      .pipe(
        map(resources => resources.map(resource => this.assembler.toEntityFromResource(resource)))
      );
  }

  getById(id: string): Observable<Responsible> {
    return this.http.get<ResponsibleResource>(`${this.baseUrl}/${id}`)
      .pipe(
        map(resource => this.assembler.toEntityFromResource(resource))
      );
  }

  create(responsible: Responsible): Observable<Responsible> {
    // SIMPLIFICADO: Como ya todo se llama 'phone', no necesitamos convertir nada manual.
    const resource = this.assembler.toResourceFromEntity(responsible);

    console.log('Creating with resource:', resource);

    return this.http.post<ResponsibleResource>(this.baseUrl, resource)
      .pipe(
        map(response => this.assembler.toEntityFromResource(response))
      );
  }

  patch(id: string, partial: Partial<Responsible>): Observable<Responsible> {
    return this.http.patch<Responsible>(`${this.baseUrl}/${id}`, partial);
  }

  update(id: string, responsible: Responsible): Observable<Responsible> {
    const resource = this.assembler.toResourceFromEntity(responsible);
    return this.http.put<ResponsibleResource>(`${this.baseUrl}/${id}`, resource)
      .pipe(
        map(response => this.assembler.toEntityFromResource(response))
      );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(keyword: string): Observable<Responsible[]> {
    return this.http.get<ResponsibleResource[]>(`${this.baseUrl}/search`, {
      params: { keyword }
    }).pipe(
      map(resources => resources.map(resource => this.assembler.toEntityFromResource(resource)))
    );
  }

  // Métodos que usan el store local (no hacen llamadas API)
  getResponsibleById(id: string): Responsible | null {
    const cleanId = id.replace('$', '').trim();
    const allResponsibles = this.store.responsibles();
    return allResponsibles.find(r => r.id === cleanId) || null;
  }

  getResponsibleByName(fullName: string): Responsible | null {
    if (!fullName || fullName === 'Not assigned') {
      return null;
    }

    const nameOnly = fullName.split(' - ')[0].trim();
    const found = this.store.responsibles().find(r => {
      const responsibleFullName = r.fullName.toLowerCase();
      const searchName = nameOnly.toLowerCase();
      return responsibleFullName.includes(searchName) ||
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchName) ||
        responsibleFullName === searchName;
    });

    return found || null;
  }

  findResponsibleFromAssignedTo(assignedTo: string): Responsible | null {
    if (!assignedTo || assignedTo === 'Not assigned') {
      return null;
    }

    const idMatch = assignedTo.match(/\[(.*?)\]/);
    if (idMatch) {
      const id = idMatch[1];
      const byId = this.getResponsibleById(id);
      if (byId) return byId;
    }

    return this.getResponsibleByName(assignedTo);
  }

  getAllResponsibles(): Responsible[] {
    return this.store.responsibles();
  }

  getResponsibleOptions(): string[] {
    return this.store.responsibles().map(r =>
      `${r.fullName} - ${r.position || r.role} [${r.id}]`
    );
  }
}
