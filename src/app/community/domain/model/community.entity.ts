import { BaseEntity } from '../../../shared/domain/model/base-entity';

export interface Comment {
  author: string;
  content: string;
  date: Date;
}

export class Community implements BaseEntity {
  private _id: number;
  private _userId: number;
  private _author: string;
  private _content: string;
  private _imageUrl?: string;
  private _likes: number;
  private _createdAt: Date;
  private _comments: Comment[];

  constructor(community: {
    id: number;
    userId: number;
    author: string;
    content: string;
    imageUrl?: string;
    likes?: number;
    createdAt?: Date;
    comments?: Comment[];
  }) {
    this._id = community.id;
    this._userId = community.userId;
    this._author = community.author;
    this._content = community.content;
    this._imageUrl = community.imageUrl;
    this._likes = community.likes ?? 0;
    this._createdAt = community.createdAt ?? new Date();
    this._comments = community.comments ?? [];
  }

  // --- Getters ---
  get id(): number {
    return this._id;
  }

  get userId(): number {
    return this._userId;
  }

  get author(): string {
    return this._author;
  }

  get content(): string {
    return this._content;
  }

  get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  get likes(): number {
    return this._likes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get comments(): Comment[] {
    return this._comments;
  }

  like(): void {
    this._likes++;
  }

  addComment(comment: Comment): void {
    this._comments.push(comment);
  }
  unlike(): void {
    if (this._likes > 0) this._likes--;
  }

}
