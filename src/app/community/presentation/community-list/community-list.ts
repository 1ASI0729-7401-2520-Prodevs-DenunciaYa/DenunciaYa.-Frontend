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
/**
 * @class CommunityList
 * @summary Component for displaying a list of community posts with likes and comments functionality.
 * @constructor
 * @param {CommunityStore} communityStore - Store for managing community posts.
 * @method onToggleLike - Toggles the like status of a post.
 * @param {Community} post - The community post to like or unlike.
 * @method toggleComments - Toggles the visibility of the comments section for a post.
 * @param {Community} post - The community post to show or hide comments for.
 * @method toggleShowComments - Toggles between showing all comments or a limited number for a post.
 * @param {Community} post - The community post to toggle comment visibility for.
 * @method getDisplayedComments - Retrieves the comments to be displayed for a post based on the current visibility settings.
 * @param {Community} post - The community post to get comments for.
 * @return {Comment[]} An array of comments to be displayed.
 * @method addComment - Adds a new comment to a post.
 * @param {Community} post - The community post to add a comment to.
 * @method onDelete - Deletes a community post after user confirmation.
 * @param {number} postId - The ID of the community post to delete.
 * @method trackById - TrackBy function for optimizing ngFor rendering.
 * @param {number} index - The index of the item in the ngFor loop.
 * @param {Community} item - The community post item.
 * @return {number} The unique identifier of the community post.
 */
export class CommunityList {
  newComments: Record<number, string> = {};
  showComments: Record<number, boolean> = {};
  showAllComments: Record<number, boolean> = {};

  userName: string = 'Usuario';

  constructor(public communityStore: CommunityStore) {
    this.loadUserName();
  }

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
    if (confirm('Do you want to delete this post?')) {
      this.communityStore.deleteCommunity(postId);
    }
  }

  trackById(index: number, item: Community): number {
    return item.id;
  }
}
