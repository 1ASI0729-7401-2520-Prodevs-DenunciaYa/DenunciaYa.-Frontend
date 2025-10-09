import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Responsible } from '../domain/model/responsibleCreate.entity';
import { ResponsibleAssembler } from './responsibleCreate.assembler';
import {
  ResponsibleResource,
  ResponsiblesResponse,
} from './responsibleCreate.response';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';

const responsibleEndpointUrl = 'http://localhost:3000/responsibles';

@Injectable({ providedIn: 'root' })
export class ResponsibleApiEndpoint extends BaseApiEndpoint<
  Responsible,
  ResponsibleResource,
  ResponsiblesResponse,
  ResponsibleAssembler
> {
  constructor(http: HttpClient) {
    super(http, responsibleEndpointUrl, new ResponsibleAssembler());
  }

  patch(id: number, partial: Partial<Responsible>): Observable<Responsible> {
    return this.http.patch<Responsible>(`${this.endpointUrl}/${id}`, partial);
  }
}
