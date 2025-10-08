import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface CommentResource {
  author: string;
  content: string;
  date: string;
}

export interface CommunityResource extends BaseResource {
  id: number;
  userId: number;
  content: string;
  imageUrl?: string;
  author: string;

  likes: number;
  createdAt: string;
  comments: CommentResource[];
}

export interface CommunitiesResponse extends BaseResponse {
  communities: CommunityResource[];
}
