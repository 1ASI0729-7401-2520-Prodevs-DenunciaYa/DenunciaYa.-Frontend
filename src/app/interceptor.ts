import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // Debug: mostrar si hay token (no imprimir el token completo en producción)
    try {
      console.debug('[AuthInterceptor] token present:', !!token);
      if (token) {
        const preview = `${token.slice(0, 10)}...${token.slice(-8)}`;
        console.debug('[AuthInterceptor] token preview:', preview, 'length:', token.length, 'type:', typeof token);
      }
    } catch (e) {
      // ignore
    }

    // Validar token básico (no enviar "null"/"undefined" ni valores que no tengan formato JWT)
    const isValidToken = typeof token === 'string' && token !== 'null' && token !== 'undefined' && token.split('.').length === 3;

    if (isValidToken && token) {
      // Clona la solicitud y agrega el header Authorization
      const authHeader = `Bearer ${token}`;
      const authReq = req.clone({
        headers: req.headers.set('Authorization', authHeader)
      });
      try {
        console.debug('[AuthInterceptor] Adding Authorization header for request to', req.url, 'headerPreview:', `${authHeader.slice(0, 12)}...`);
        console.debug('[AuthInterceptor] authReq Authorization header actual:', authReq.headers.get('Authorization'));
      } catch (e) {}
      return next.handle(authReq);
    }

    // Si no hay token válido, sigue con la solicitud original
    return next.handle(req);
  }
}
