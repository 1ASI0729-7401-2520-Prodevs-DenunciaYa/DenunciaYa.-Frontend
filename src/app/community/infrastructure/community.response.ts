import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * @interface CommentResource
 * @summary Represents a comment on a community post.
 * @author string - The author of the comment.
 * @content string - The content of the comment.
 * @date string - The date the comment was made.
 */
export interface CommentResource {
  author: string;
  content: string;
  date: string;
}

/**
 * @interface CommunityResource
 * @summary Represents a community post resource.
 * @id number - The unique identifier of the community post.
 * @userId number - The identifier of the user who created the post.
 * @content string - The content of the community post.
 * @imageUrl string (optional) - The URL of an image associated with the post.
 * @author string - The author of the community post.
 * @likes number - The number of likes the post has received.
 * @createdAt string - The date the post was created.
 * @comments CommentResource[] - An array of comments associated with the post.
 */
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
