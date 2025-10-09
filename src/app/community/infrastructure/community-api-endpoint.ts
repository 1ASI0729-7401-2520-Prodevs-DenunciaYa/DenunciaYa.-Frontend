import { Injectable } from '@angular/core';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { CommunityAssembler } from './community.assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CommunitiesResponse, CommunityResource } from './community.response';
import { Community } from '../domain/model/community.entity';

const communitiesEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderCommunitiesEndpointPath}`;

@Injectable({ providedIn: 'root' }) // 👈 Añadir esto
export class CommunityApiEndpoint extends BaseApiEndpoint<
  Community,
  CommunityResource,
  CommunitiesResponse,
  CommunityAssembler
> {
  constructor(http: HttpClient) {
    super(http, communitiesEndpointUrl, new CommunityAssembler());
  }

  patch(id: number, partial: Partial<Community>): Observable<Community> {
    return this.http.patch<Community>(`${communitiesEndpointUrl}/${id}`, partial);
  }
}
