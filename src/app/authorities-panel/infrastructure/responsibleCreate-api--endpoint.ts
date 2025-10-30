import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Responsible } from '../domain/model/responsibleCreate.entity';
import { ResponsibleAssembler } from './responsibleCreate.assembler';
import { ResponsibleResource, ResponsiblesResponse } from './responsibleCreate.response';
import { environment } from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ResponsibleApiEndpoint {
  private readonly endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderResponsiblesEndpointPath}`;
  private assembler = new ResponsibleAssembler();

  constructor(private http: HttpClient) {}

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
}
