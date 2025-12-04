import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  /**
   * Intenta subir `file` a un endpoint de uploads y devuelve la URL pública o path que devuelva el backend.
   * Prueba en orden: http://HOST/uploads/posts  y  http://HOST/api/v1/uploads/posts
   */
  uploadPostImage(file: File): Observable<string> {
    const hostBase = environment.apiBaseUrl.replace(/\/api\/v1$/, '');
    const endpoints = [
      `${hostBase}/uploads/posts`,
      `${environment.apiBaseUrl}/uploads/posts`
    ];

    const form = new FormData();
    form.append('file', file, file.name);

    const tryEndpoint = (url: string): Observable<string> => {
      return this.http.post<any>(url, form).pipe(
        map((res) => {
          if (!res) throw new Error('Invalid upload response');
          if (typeof res === 'string') return this.normalizeUrl(res, hostBase);
          if (res.url) return this.normalizeUrl(res.url, hostBase);
          if (res.path) return this.normalizeUrl(res.path, hostBase);
          if (res.filePath) return this.normalizeUrl(res.filePath, hostBase);
          const keys = Object.keys(res);
          for (const k of keys) {
            if (typeof res[k] === 'string' && (res[k] as string).length > 0) return this.normalizeUrl(res[k], hostBase);
          }
          throw new Error('Upload response did not contain path/url');
        }),
        catchError((err) => throwError(() => err))
      );
    };

    return tryEndpoint(endpoints[0]).pipe(
      catchError(() => tryEndpoint(endpoints[1]))
    );
  }

  private normalizeUrl(value: string, hostBase: string): string {
    if (!value) return value;
    // Si es ruta relativa que empieza con /, unir con hostBase
    if (value.startsWith('/')) return `${hostBase}${value}`;
    // Si es path relativo sin slash, añadir /uploads prefix
    if (!value.startsWith('http')) return `${hostBase}/${value}`;
    return value;
  }
}
