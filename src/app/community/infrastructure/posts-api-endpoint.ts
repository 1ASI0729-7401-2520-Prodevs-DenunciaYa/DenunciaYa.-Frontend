import { Injectable } from '@angular/core';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PostAssembler } from './post.assembler';
import { Community } from '../domain/model/community.entity';
import { PostResource, PostsResponse } from './post.response';
import { map, catchError } from 'rxjs/operators';

const postsEndpointUrl = `${environment.platformProviderApiBaseUrl}/posts`;

@Injectable({ providedIn: 'root' })
export class PostsApiEndpoint extends BaseApiEndpoint<Community, PostResource, PostsResponse, PostAssembler> {
  constructor(http: HttpClient) {
    super(http, postsEndpointUrl, new PostAssembler());
  }

  patch(id: number, partial: Partial<Community>) {
    return this.http.patch<Community>(`${postsEndpointUrl}/${id}`, partial);
  }

  /**
   * Crea un post aceptando multipart/form-data cuando hay un archivo.
   * Si se pasa `file`, enviamos FormData con el archivo bajo la clave `image` y
   * los demás campos como texto. Si no hay archivo, se envía JSON normal.
   */
  createFromForm(entity: Community, file?: File) {
    if (file) {
      const form = new FormData();
      // Enviar la metadata como una parte JSON llamada `post` (método compatible con @RequestPart en Spring)
      const metadata: any = {
        userId: entity.userId,
        author: entity.author,
        content: entity.content,
        likes: entity.likes ?? 0,
        createdAt: (entity.createdAt ?? new Date()).toISOString(),
        imageUrl: entity.imageUrl ?? file.name
      };

      form.append('post', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      // El archivo con la clave `image` que es la más habitual en controladores Spring
      form.append('image', file, file.name);

      // No fijamos Content-Type (el navegador lo hará con boundary).
      return this.http.post<PostResource>(this.endpointUrl, form).pipe(
        map(created => this.assembler.toEntityFromResource(created))
      );
    }

    // Fallback: sin archivo se comporta igual que create()
    return this.create(entity);
  }
}
