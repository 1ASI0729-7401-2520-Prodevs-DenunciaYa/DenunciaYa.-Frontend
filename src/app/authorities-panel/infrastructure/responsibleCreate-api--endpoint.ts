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
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ResponsibleApiEndpoint extends BaseApiEndpoint<
  Responsible,
  ResponsibleResource,
  ResponsiblesResponse,
  ResponsibleAssembler
> {
  // ✅ Usa override (la clase base ya tiene esta propiedad)
  override readonly endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderResponsiblesEndpointPath}`;

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderResponsiblesEndpointPath}`,
      new ResponsibleAssembler()
    );
  }

  // 👇 Este método no necesita override, porque no existe en la base
  patch(id: number, partial: Partial<Responsible>): Observable<Responsible> {
    return this.http.patch<Responsible>(`${this.endpointUrl}/${id}`, partial);
  }
}
