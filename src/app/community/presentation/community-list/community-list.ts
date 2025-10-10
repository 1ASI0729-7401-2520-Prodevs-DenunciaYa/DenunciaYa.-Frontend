import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommunityStore } from '../../application/community.store';
import { Community, Comment } from '../../domain/model/community.entity';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-community-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './community-list.html',
  styleUrls: ['./community-list.css']
})
export class CommunityList {
  newComments: Record<number, string> = {};
  showComments: Record<number, boolean> = {};
  showAllComments: Record<number, boolean> = {};

  userName: string = 'Usuario'; // 👈 añadimos esto

  constructor(public communityStore: CommunityStore) {
    this.loadUserName();
  }

  /** Carga el nombre del usuario logueado desde localStorage */
  private loadUserName(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuario';
    }
  }

  onToggleLike(post: Community): void {
    this.communityStore.toggleLike(post.id);
  }

  toggleComments(post: Community): void {
    this.showComments[post.id] = !this.showComments[post.id];
  }

  toggleShowComments(post: Community): void {
    this.showAllComments[post.id] = !this.showAllComments[post.id];
  }

  getDisplayedComments(post: Community): Comment[] {
    if (!post.comments) return [];
    if (this.showAllComments[post.id]) return post.comments;
    return post.comments.slice(0, 5);
  }

  addComment(post: Community): void {
    const content = this.newComments[post.id]?.trim();
    if (!content) return;

    this.communityStore.addComment(post.id, this.userName, content);

    this.newComments[post.id] = '';
    this.showComments[post.id] = true;
  }

  onDelete(postId: number): void {
    if (confirm('¿Seguro que deseas eliminar esta publicación?')) {
      this.communityStore.deleteCommunity(postId);
    }
  }

  trackById(index: number, item: Community): number {
    return item.id;
  }
}
