// ...existing code...
export interface CommentResource {
  id?: number;
  userId?: number | string;
  author: string;
  content: string;
  createdAt: string;
}

export interface PostResource {
  id: number;
  userId: number | string;
  author: string;
  content: string;
  imageUrl?: string;
  likes: number;
  createdAt: string;
  updatedAt?: string;
  comments?: CommentResource[];
}

export type PostsResponse = PostResource[];


