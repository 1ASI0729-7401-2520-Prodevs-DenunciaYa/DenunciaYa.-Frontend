// ...existing code...
import { PostResource, PostsResponse } from './post.response';
import { Community } from '../domain/model/community.entity';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';

export class PostAssembler implements BaseAssembler<Community, PostResource, PostsResponse> {
  toEntitiesFromResponse(response: PostsResponse): Community[] {
    return response.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: PostResource): Community {
    return new Community({
      id: resource.id,
      userId: typeof resource.userId === 'number' ? resource.userId : Number(resource.userId),
      author: resource.author,
      content: resource.content,
      imageUrl: resource.imageUrl,
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

