import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CommunityStore } from '../../application/community.store';
import { Community } from '../../domain/model/community.entity';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-community-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslatePipe
  ],
  templateUrl: './community-form.html',
  styleUrls: ['./community-form.css']
})
export class CommunityForm {
  content: string = '';
  imageUrl: string | null = null;
  imageFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private communityStore: CommunityStore) {}

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.imageFile = file;
  }

  submitPost(): void {
    if (!this.content.trim() && !this.imageUrl) return;

    const newPost = new Community({
      id: Date.now(),
      userId: 1, // temporal
      author: 'Usuario',
      content: this.content,
      imageUrl: this.imageUrl || undefined,
      likes: 0,
      createdAt: new Date()
    });

    this.communityStore.addCommunity(newPost);
    this.resetForm();
  }

  private resetForm(): void {
    this.content = '';
    this.imageUrl = null;
    this.imageFile = null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
