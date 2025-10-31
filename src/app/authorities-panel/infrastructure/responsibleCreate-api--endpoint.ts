import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Responsible } from '../domain/model/responsibleCreate.entity';
import { ResponsibleAssembler } from './responsibleCreate.assembler';
import { ResponsibleResource, ResponsiblesResponse } from './responsibleCreate.response';
import { environment } from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {ResponsibleCreateStore} from '../application/responsibleCreate.store';

/**
 * @class Responsible
 * @summary Handles API interactions related to "responsible" entities, including CRUD operations and utility methods for retrieving responsibles by ID or name.
 * @constructor @param {HttpClient} http - The HTTP client for making API requests.
 * @method getAll - Fetches all responsible entities.
 * @method getById - Fetches a responsible entity by its ID.
 * @method create - Creates a new responsible entity.
 * @method patch - Partially updates a responsible entity by its ID.
 * @method update - Fully updates a responsible entity by its ID.
 * @method delete - Deletes a responsible entity by its ID.
 * @method getResponsibleById - Retrieves a responsible entity from the store by its ID.
 * @method getResponsibleByName - Retrieves a responsible entity from the store by its full name.
 * @method findResponsibleFromAssignedTo - Finds a responsible entity based on an "assigned to" string.
 * @method getAllResponsibles - Retrieves all responsible entities from the store.
 * @method getResponsibleOptions - Retrieves formatted options for all responsibles from the store.
 */
@Injectable({ providedIn: 'root' })
export class ResponsibleApiEndpoint {
  private readonly endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderResponsiblesEndpointPath}`;
  private assembler = new ResponsibleAssembler();
  private readonly store = inject(ResponsibleCreateStore);

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Responsible[]> {
    return this.http.get<ResponsibleResource[]>(this.endpointUrl)
      .pipe(
        map(resources => resources.map(resource => this.assembler.toEntityFromResource(resource)))
      );
  }

  getById(id: string): Observable<Responsible> {
    return this.http.get<ResponsibleResource>(`${this.endpointUrl}/${id}`)
      .pipe(
        map(resource => this.assembler.toEntityFromResource(resource))
      );
  }

  create(responsible: Responsible): Observable<Responsible> {
    const resource = this.assembler.toResourceFromEntity(responsible);
    return this.http.post<ResponsibleResource>(this.endpointUrl, resource)
      .pipe(
        map(response => this.assembler.toEntityFromResource(response))
      );
  }

  patch(id: string, partial: Partial<Responsible>): Observable<Responsible> {
    return this.http.patch<Responsible>(`${this.endpointUrl}/${id}`, partial);
  }

  update(id: string, responsible: Responsible): Observable<Responsible> {
    const resource = this.assembler.toResourceFromEntity(responsible);
    return this.http.put<ResponsibleResource>(`${this.endpointUrl}/${id}`, resource)
      .pipe(
        map(response => this.assembler.toEntityFromResource(response))
      );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`);
  }

  getResponsibleById(id: string): Responsible | null {

    const cleanId = id.replace('$', '').trim();

    const allResponsibles = this.store.responsibles();

    const found = allResponsibles.find(r => r.id === cleanId);

    if (found) {
    } else {
    }

    return found || null;
  }

  getResponsibleByName(fullName: string): Responsible | null {
    if (!fullName || fullName === 'Not assigned') {
      return null;
    }



    const nameOnly = fullName.split(' - ')[0].trim();

    const found = this.store.responsibles().find(r => {
      const responsibleFullName = r.fullName.toLowerCase();
      const searchName = nameOnly.toLowerCase();

      const matches =
        responsibleFullName.includes(searchName) ||
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchName) ||
        responsibleFullName === searchName;

      if (matches) {
      }

      return matches;
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
    const all = this.store.responsibles();
    return all;
  }

  getResponsibleOptions(): string[] {
    const options = this.store.responsibles().map(r =>
      `${r.fullName} - ${r.position || r.role} [${r.id}]`
    );
    return options;
  }
}
