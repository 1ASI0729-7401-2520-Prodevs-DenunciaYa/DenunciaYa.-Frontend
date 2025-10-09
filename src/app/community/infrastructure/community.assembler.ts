import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { CommunitiesResponse, CommunityResource } from './community.response';
import { Community } from '../domain/model/community.entity';

export class CommunityAssembler implements BaseAssembler<Community, CommunityResource, CommunitiesResponse> {
  toEntitiesFromResponse(response: CommunitiesResponse): Community[] {
    return response.communities.map(resource => this.toEntityFromResource(resource as CommunityResource));
  }

  toEntityFromResource(resource: CommunityResource): Community {
    return new Community({
      id: resource.id,
      userId: resource.userId,
      author: resource.author,
      content: resource.content,
      imageUrl: resource.imageUrl,
      likes: resource.likes,
      createdAt: new Date(resource.createdAt),
      comments: resource.comments?.map(c => ({
        author: c.author,
        content: c.content,
        date: new Date(c.date)
      })) ?? []
    });
  }

  toResourceFromEntity(entity: Community): CommunityResource {
    return {
      id: entity.id,
      userId: entity.userId,
      author: entity.author,
      content: entity.content,
      imageUrl: entity.imageUrl,
      likes: entity.likes,
      createdAt: entity.createdAt.toISOString(),
      comments: entity.comments.map(c => ({
        author: c.author,
        content: c.content,
        date: c.date.toISOString()
      }))
    } as CommunityResource;
  }
}
