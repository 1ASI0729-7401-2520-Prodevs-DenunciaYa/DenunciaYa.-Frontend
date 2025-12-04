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
import { PostsApiEndpoint } from '../../infrastructure/posts-api-endpoint';
import { ProfileService } from '../../../public/services/profile.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UploadService } from '../../../public/services/upload.service';

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

   constructor(private communityStore: CommunityStore, private postsApi: PostsApiEndpoint, private profileService: ProfileService, private uploadService: UploadService) {}

   private resolveAuthor() {
     // Devuelve un Observable con { name, id }
     const userData = localStorage.getItem('user');
     const currentUser = localStorage.getItem('currentUser');

     if (userData) {
       try {
         const user = JSON.parse(userData);
         const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || (user.username || user.email) || 'Usuario';
         const id = user.id || user.userId || user.sub || user.onid || 1;
         return of({ name, id });
       } catch (e) {
         return of({ name: String(userData) || 'Usuario', id: 1 });
       }
     }

     if (currentUser) {
       const maybeId = localStorage.getItem('onid') || localStorage.getItem('workerId') || localStorage.getItem('ownerId') || localStorage.getItem('userId');
       return of({ name: currentUser, id: maybeId ? Number(maybeId) : 1 });
     }

     const token = localStorage.getItem('token');
     if (token) {
       try {
         const parts = token.split('.');
         if (parts.length >= 2) {
           const payload = JSON.parse(atob(parts[1]));
           const name = payload.name || payload.username || payload.preferred_username || payload.email || 'Usuario';
           const id = payload.sub || payload.userId || payload.id || 1;
           return of({ name, id });
         }
       } catch (e) {
         // ignore and try profile endpoint
       }
     }

     // Fallback: pedir profile al backend (si está autenticado)
     return this.profileService.getProfile().pipe(
       map(profile => ({ name: profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : (profile?.email || profile?.username || 'Usuario'), id: profile?.id || 1 })),
       catchError(() => of({ name: 'Usuario', id: 1 }))
     );
   }

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

     this.resolveAuthor().subscribe(({ name: authorName, id: userId }) => {
       const newPost = new Community({
         id: Date.now(),
         userId: userId,
         author: authorName,
         content: this.content,
         imageUrl: this.imageUrl ? this.imageUrl : '/assets/images/secret-image.png',
         likes: 0,
         createdAt: new Date(),
       });


       if (this.imageFile) {
         // Primero intentar subir la imagen al backend y usar la URL resultante
         this.uploadService.uploadPostImage(this.imageFile).pipe(
           catchError((uploadErr) => {
             console.warn('Upload failed, falling back to dataURL strategy', uploadErr);
             // Fallback: devolver observable con null para indicar que fallo
             return of(null as any);
           })
         ).subscribe((uploadedUrl) => {
           if (uploadedUrl) {
             // Usar la URL devuelta por el backend
             const postWithUrl = new Community({
               id: newPost.id,
               userId: newPost.userId,
               author: newPost.author,
               content: newPost.content,
               imageUrl: uploadedUrl,
               likes: newPost.likes,
               createdAt: newPost.createdAt,
               comments: newPost.comments
             });

             this.postsApi.create(postWithUrl).subscribe({
               next: (created) => {
                 this.communityStore['communitiesSignal']?.update?.((c: any) => [...c, created]);
                 this.resetForm();
               },
               error: (err) => {
                 console.error('Error creando post con imagen (upload URL)', err);
                 this.resetForm();
               }
             });

           } else {
             // Fallback: convertir a dataURL y usar la implementación previa
             this.postsApi.create(newPost, this.imageFile!).subscribe({
               next: (created) => {
                 this.communityStore['communitiesSignal']?.update?.((c: any) => [...c, created]);
                 this.resetForm();
               },
               error: (err) => {
                 console.error('Error creando post con imagen (fallback dataURL)', err);
                 this.resetForm();
               }
             });
           }
         });

       } else {
         // No hay archivo: usar create normal y esperar confirmación del backend antes de actualizar la UI
         this.postsApi.create(newPost).subscribe({
           next: (created) => {
             this.communityStore['communitiesSignal']?.update?.((c: any) => [...c, created]);
             this.resetForm();
           },
           error: (err) => {
             console.error('Error creando post', err);
             this.resetForm();
           }
         });
       }
     });
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
