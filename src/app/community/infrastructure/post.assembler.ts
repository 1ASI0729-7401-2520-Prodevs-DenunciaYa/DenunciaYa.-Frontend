// ...existing code...
import { PostResource, PostsResponse } from './post.response';
import { Community } from '../domain/model/community.entity';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { environment } from '../../../environments/environment';

export class PostAssembler implements BaseAssembler<Community, PostResource, PostsResponse> {
  toEntitiesFromResponse(response: PostsResponse): Community[] {
    return response.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: PostResource): Community {
    // Normalizar imageUrl: si el backend devuelve la imagen por defecto `secret-image.png`,
    // considerarla como inexistente para que la UI no la muestre.
    let normalizedImageUrl = resource.imageUrl && resource.imageUrl.indexOf('secret-image.png') === -1
      ? resource.imageUrl
      : undefined;

    // Si la URL existe y no es absoluta, convertirla a absoluta usando el host del apiBaseUrl.
    // Muchos backends devuelven rutas como `/uploads/xxx.jpg`. environment.apiBaseUrl puede incluir `/api/v1`,
    // por lo que removemos ese sufijo para obtener el host base (ej. http://localhost:8080).
    if (normalizedImageUrl) {
      const isAbsolute = normalizedImageUrl.startsWith('http://') || normalizedImageUrl.startsWith('https://');
      if (!isAbsolute) {
        const apiBase = environment.apiBaseUrl || '';
        // Remover el sufijo /api/v1 si está presente para obtener el host base
        const serverBase = apiBase.replace(/\/api\/v1\/?$/i, '').replace(/\/$/, '');
        // Garantizar que normalizedImageUrl tenga un slash inicial
        const path = normalizedImageUrl.startsWith('/') ? normalizedImageUrl : `/${normalizedImageUrl}`;
        normalizedImageUrl = serverBase ? `${serverBase}${path}` : path;
      }
    }

    return new Community({
      id: resource.id,
      userId: typeof resource.userId === 'number' ? resource.userId : Number(resource.userId),
      author: resource.author,
      content: resource.content,
      imageUrl: normalizedImageUrl,
      likes: resource.likes,
      createdAt: new Date(resource.createdAt),
      comments: resource.comments?.map(c => ({ author: c.author, content: c.content, date: new Date(c.createdAt) })) ?? []
    });
  }

  toResourceFromEntity(entity: Community): PostResource {
    return {
      id: entity.id,
      userId: entity.userId,
      author: entity.author,
      content: entity.content,
      imageUrl: entity.imageUrl,
      likes: entity.likes,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.createdAt.toISOString(),
      comments: entity.comments.map(c => ({ author: c.author, content: c.content, createdAt: c.date.toISOString() }))
    } as PostResource;
  }
}
