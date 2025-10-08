import { Injectable, Signal, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { Community } from '../domain/model/community.entity';
import { CommunityApiEndpoint } from '../infrastructure/community-api-endpoint';

@Injectable({ providedIn: 'root' })
export class CommunityStore {
  private readonly communitiesSignal = signal<Community[]>([]);
  private readonly likedPostsSignal = signal<Set<number>>(new Set());
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly communities = this.communitiesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly communityCount = computed(() => this.communities().length);

  constructor(private readonly communityApi: CommunityApiEndpoint) {
    this.loadCommunities();
  }


  loadCommunities(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.communityApi
      .getAll()
      .pipe(takeUntilDestroyed(), retry(2))
      .subscribe({
        next: (communities) => {
          this.communitiesSignal.set(communities);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Error al cargar publicaciones'));
          this.loadingSignal.set(false);
        },
      });
  }


  addCommunity(post: Community): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.communityApi
      .create(post)
      .pipe(retry(2))
      .subscribe({
        next: (created) => {
          this.communitiesSignal.update((posts) => [...posts, created]);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Error al crear publicación'));
          this.loadingSignal.set(false);
        },
      });
  }


  addComment(postId: number, author: string, content: string): void {
    const posts = this.communitiesSignal();
    const postIndex = posts.findIndex((p) => p.id === postId);

    if (postIndex !== -1) {
      const newComment = { author, content, date: new Date() };
      posts[postIndex].addComment(newComment);
      this.communitiesSignal.set([...posts]); // ⚡ Actualiza la señal
    }
  }


  deleteCommunity(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.communityApi
      .delete(id)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.communitiesSignal.update((posts) => posts.filter((p) => p.id !== id));
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Error al eliminar publicación'));
          this.loadingSignal.set(false);
        },
      });
  }


  toggleLike(id: number): void {
    const likedSet = new Set(this.likedPostsSignal());
    const posts = [...this.communitiesSignal()];
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    if (likedSet.has(id)) {
      post.unlike?.(); // si agregaste unlike() opcional
      likedSet.delete(id);
    } else {
      post.like();
      likedSet.add(id);
    }

    this.likedPostsSignal.set(likedSet);
    this.communitiesSignal.set(posts);

    this.communityApi.patch(id, { likes: post.likes }).pipe(retry(2)).subscribe({
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Error al actualizar "like"'));
      },
    });
  }


  getCommunityById(id: number | null | undefined): Signal<Community | undefined> {
    return computed(() => (id ? this.communities().find((c) => c.id === id) : undefined));
  }


  hasLiked(id: number): Signal<boolean> {
    return computed(() => this.likedPostsSignal().has(id));
  }


  private formatError(error: any, fallback: string): string {
    if (error instanceof Error)
      return error.message.includes('Resource not found')
        ? `${fallback}: no encontrado`
        : error.message;
    return fallback;
  }
}
