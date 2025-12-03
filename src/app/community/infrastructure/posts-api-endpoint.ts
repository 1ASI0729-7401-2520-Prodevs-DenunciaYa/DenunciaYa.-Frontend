// ...existing code...
import { Injectable } from '@angular/core';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PostAssembler } from './post.assembler';
import { Community } from '../domain/model/community.entity';
import { PostResource, PostsResponse } from './post.response';

const postsEndpointUrl = `${environment.platformProviderApiBaseUrl}/posts`;

@Injectable({ providedIn: 'root' })
export class PostsApiEndpoint extends BaseApiEndpoint<Community, PostResource, PostsResponse, PostAssembler> {
  constructor(http: HttpClient) {
    super(http, postsEndpointUrl, new PostAssembler());
  }

  patch(id: number, partial: Partial<Community>) {
    return this.http.patch<Community>(`${postsEndpointUrl}/${id}`, partial);
  }
}

