import { Injectable } from '@angular/core';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PostAssembler } from './post.assembler';
import { Community } from '../domain/model/community.entity';
import { PostResource, PostsResponse } from './post.response';
import { map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

const postsEndpointUrl = `${environment.apiBaseUrl}/posts`;

@Injectable({ providedIn: 'root' })
export class PostsApiEndpoint extends BaseApiEndpoint<Community, PostResource, PostsResponse, PostAssembler> {
  constructor(http: HttpClient) {
    super(http, postsEndpointUrl, new PostAssembler());
  }

  private authHeaders(): { headers?: HttpHeaders } {
    const token = localStorage.getItem('token');
    if (token && typeof token === 'string' && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    }
    return {};
  }

  patch(id: number, partial: Partial<Community>) {
    return this.http.patch<Community>(`${postsEndpointUrl}/${id}`, partial, this.authHeaders());
  }

  /**
   * Obtiene todos los posts y los convierte a entidades usando el assembler.
   */
  override getAll(): Observable<Community[]> {
    const opts = this.authHeaders();
    return this.http.get<PostResource[]>(this.endpointUrl, opts).pipe(
      map(res => Array.isArray(res) ? res.map(r => this.assembler.toEntityFromResource(r as PostResource)) : []),
      catchError(this.handleError('Failed to fetch posts'))
    );
  }

  /**
   * Obtiene un post por su id.
   */
  override getById(id: number): Observable<Community> {
    const opts = this.authHeaders();
    return this.http.get<PostResource>(`${this.endpointUrl}/${id}`, opts).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError(`Failed to fetch post with id=${id}`))
    );
  }

  /**
   * Crea un post. El backend espera un JSON con CreatePostResource (incluye imageUrl string).
   * Si se pasa un File, lo convertimos a dataURL (base64) y establecemos entity.imageUrl antes de enviar JSON.
   */
  override create(entity: Community, file?: File) {
    const opts = this.authHeaders();

    if (file) {
      const resource = this.assembler.toResourceFromEntity(entity) as any;
      const form = new FormData();
      form.append('post', JSON.stringify(resource));
      form.append('image', file, file.name);

      return this.http.post(this.endpointUrl, form, {
        ...opts,          // solo Authorization
        responseType: 'json'
      }).pipe(
        map((raw: any) => this.assembler.toEntityFromResource(raw as PostResource)),
        catchError(this.handleError('Failed to create post'))
      );
    }

    // Sin archivo: construir resource y enviar JSON con headers explícitos
    const resource = this.assembler.toResourceFromEntity(entity) as any;
    return this.http.post(this.endpointUrl, resource, { ...opts, responseType: 'text' as 'json' }).pipe(
      map((raw: any) => {
        let parsed = raw;
        if (typeof raw === 'string') {
          try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
        }
        if (!parsed) throw new Error('Empty or invalid response from server when creating post');
        return this.assembler.toEntityFromResource(parsed as PostResource);
      }),
      catchError(this.handleError('Failed to create post'))
    );
  }
  createMultipart(formData: FormData) {
    const opts = this.authHeaders();
    // No fijar Content-Type, Angular lo hace automáticamente con boundary
    return this.http.post(this.endpointUrl, formData, { ...opts, responseType: 'json' }).pipe(
      map((raw: any) => this.assembler.toEntityFromResource(raw as PostResource)),
      catchError(this.handleError('Failed to create post'))
    );
  }


  /**
   * Convierte un File a data URL (base64) en una Promise.
   */
  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Elimina un post por id. Implementado como override para mantener la misma firma que la clase base.
   */
  override delete(id: number) {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`, this.authHeaders()).pipe(
      catchError(this.handleError(`Failed to delete post with id=${id}`))
    );
  }
}
