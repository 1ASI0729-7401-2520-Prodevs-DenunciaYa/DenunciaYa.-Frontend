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
/**
 * @class CommunityForm
 * @summary Component for creating and submitting community posts.
 * @constructor
 * @param {CommunityStore} communityStore - Store for managing community posts.
 * @method handleImageUpload - Handles image file selection and preview.
 * @param {Event} event - The file input change event.
 * @method submitPost - Submits a new community post.
 */
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

    const userData = localStorage.getItem('user');
    let authorName = 'Usuario';
    let userId = 1;

    if (userData) {
      const user = JSON.parse(userData);
      authorName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuario';
      userId = user.id || 1;
    } else {
      // Si no hay objeto `user`, intentar extraer datos del token JWT
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length >= 2) {
            const payload = JSON.parse(atob(parts[1]));
            authorName = payload.name || payload.username || payload.preferred_username || payload.email || authorName;
            userId = payload.sub || payload.userId || payload.id || userId;
          }
        } catch (e) {
          // Si falla decodificación, deja los valores por defecto
        }
      } else {
        // Aviso útil para desarrollo: si no hay token, el backend puede rechazar la petición
        console.warn('No se encontró token en localStorage: la creación de posts puede requerir autenticación');
      }
    }

    const newPost = new Community({
      id: Date.now(),
      userId: userId,
      author: authorName,
      content: this.content,
      // Si no hay imageUrl, enviamos una imagen por defecto (el backend exige que no sea null/blank)
      imageUrl: this.imageUrl || '/assets/images/secret-image.png',
      likes: 0,
      createdAt: new Date(),
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
