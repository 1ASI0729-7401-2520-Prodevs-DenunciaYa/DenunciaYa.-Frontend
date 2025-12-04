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
  uploadPostImage(file: File): Observable<string | null> {
    const hostBase = environment.apiBaseUrl.replace(/\/api\/v1$/, '');
    const endpoints = [
      `${hostBase}/uploads/posts`,
      `${environment.apiBaseUrl}/uploads/posts`
    ];

    const form = new FormData();
    form.append('file', file, file.name);

    const tryEndpoint = (url: string): Observable<string | null> => {
      // Pedimos la respuesta completa como texto para poder leer headers y cuerpos que no sean JSON
      return this.http.post(url, form, { observe: 'response', responseType: 'text' as 'json' }).pipe(
        map((httpResp: any) => {
          const resp = httpResp; // HttpResponse<string>
          // LOG: imprimir información cruda de la respuesta para diagnóstico
          try {
            const headersPreview = (resp && resp.headers && typeof resp.headers.keys === 'function') ? resp.headers.keys() : resp?.headers;
            console.debug('[UploadService] upload response url=', url, 'status=', resp?.status, 'headers=', headersPreview, 'body=', resp?.body);
          } catch (logErr) {
            console.debug('[UploadService] upload response (failed to pretty print)', resp);
          }

          const bodyText: string | null = resp?.body ?? null;
          let parsed: any = null;

          if (bodyText) {
            // Intentar parsear JSON, si falla lo tratamos como string plano
            try {
              parsed = JSON.parse(bodyText);
            } catch (e) {
              parsed = bodyText;
            }
          }

          // Si no hay body o está vacío, intentar leer header Location
          if (!parsed || (typeof parsed === 'object' && Object.keys(parsed).length === 0)) {
            const location = resp.headers?.get?.('Location') || resp.headers?.get?.('location');
            if (location) return this.normalizeUrl(location, hostBase);
            const contentLocation = resp.headers?.get?.('Content-Location') || resp.headers?.get?.('content-location');
            if (contentLocation) return this.normalizeUrl(contentLocation, hostBase);

            // Buscar en cualquier header valores que contengan '/uploads' (algunas implementaciones ponen la ruta en un header personalizado)
            try {
              const hdrKeys = resp.headers?.keys ? resp.headers.keys() : [];
              for (const hk of hdrKeys) {
                const hv = resp.headers.get(hk);
                if (hv && hv.indexOf('/uploads') !== -1) {
                  console.debug('[UploadService] found uploads path in header', hk, hv);
                  return this.normalizeUrl(hv, hostBase);
                }
              }
            } catch (e) {
              // ignore header scan errors
            }

            // Último recurso: si el servidor devolvió 2xx pero no nos dio la URL, construir una suposición usando el nombre del archivo
            const status = resp?.status;
            if (status && status >= 200 && status < 300 && file && file.name) {
              const guessed = `${hostBase}/uploads/${file.name}`;
              console.warn('[UploadService] No path in response; guessing upload url=', guessed);
              return guessed;
            }

            console.warn('[UploadService] upload response invalid or missing path; returning null');
            return null;
          }

          const res = parsed;
          if (typeof res === 'string') return this.normalizeUrl(res, hostBase);
          if (res.url) return this.normalizeUrl(res.url, hostBase);
          if (res.path) return this.normalizeUrl(res.path, hostBase);
          if (res.filePath) return this.normalizeUrl(res.filePath, hostBase);
          const keys = Object.keys(res);
          for (const k of keys) {
            if (typeof res[k] === 'string' && (res[k] as string).length > 0) return this.normalizeUrl(res[k], hostBase);
          }

          console.warn('[UploadService] parsed upload response did not contain path/url; returning null', res);
          return null;
        }),
        catchError((err) => {
          console.warn('[UploadService] upload request failed', err);
          return throwError(() => err);
        })
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
