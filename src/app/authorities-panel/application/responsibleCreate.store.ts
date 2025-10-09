import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Responsible } from '../domain/model/responsibleCreate.entity';
import { catchError, retry } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResponsibleCreateStore {
  private readonly baseUrl = 'http://localhost:3000/responsibles';

  private readonly _responsibles = signal<Responsible[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly responsibles = this._responsibles.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this.responsibles().length);

  constructor(private http: HttpClient) {
    this.loadResponsibles();
  }

  private setLoading(v: boolean) {
    this._loading.set(v);
  }
  private setError(msg: string | null) {
    this._error.set(msg);
  }
  private parseError(err: unknown, fallback: string): string {
    if (err instanceof Error) return err.message;
    // HTTP error from HttpClient often has shape { status, statusText, error }
    const anyErr = err as any;
    if (anyErr && anyErr.message) return String(anyErr.message);
    if (anyErr && anyErr.statusText) return `${fallback}: ${anyErr.statusText}`;
    return fallback;
  }

  /** Carga todos los responsables */
  loadResponsibles(): void {
    this.setLoading(true);
    this.setError(null);

    this.http
      .get<Responsible[]>(this.baseUrl)
      .pipe(
        retry(2),
        catchError((err) => {
          const message = this.parseError(err, 'Error al cargar responsables');
          this.setError(message);
          this.setLoading(false);
          return of([] as Responsible[]);
        })
      )
      .subscribe({
        next: (data: Responsible[]) => {
          this._responsibles.set(data ?? []);
          this.setLoading(false);
        },
        error: () => {

          this.setLoading(false);
        },
      });
  }

  addResponsible(responsible: Responsible): void {
    this.setLoading(true);
    this.setError(null);

    this.http
      .post<Responsible>(this.baseUrl, responsible)
      .pipe(
        catchError((err) => {
          const message = this.parseError(err, 'Error al agregar responsable');
          this.setError(message);
          this.setLoading(false);
          // Propaga el error para que el subscribe lo reciba en 'error' si lo desea
          return throwError(() => new Error(message));
        })
      )
      .subscribe({
        next: (created: Responsible) => {
          // tipado explícito aquí para evitar TS7006
          this._responsibles.update((list: Responsible[]) => [...list, created]);
          this.setLoading(false);
        },
        error: () => {
          this.setLoading(false);
        },
      });
  }

  deleteResponsible(id: number): void {
    this.setLoading(true);
    this.setError(null);

    this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((err) => {
          const message = this.parseError(err, 'Error al eliminar responsable');
          this.setError(message);
          this.setLoading(false);
          return throwError(() => new Error(message));
        })
      )
      .subscribe({
        next: () => {
          this._responsibles.update((list: Responsible[]) =>
            list.filter((r: Responsible) => r.id !== id)
          );
          this.setLoading(false);
        },
        error: () => {
          this.setLoading(false);
        },
      });
  }

  updateResponsible(id: number, updated: Responsible): void {
    this.setLoading(true);
    this.setError(null);

    this.http
      .put<Responsible>(`${this.baseUrl}/${id}`, updated)
      .pipe(
        catchError((err) => {
          const message = this.parseError(err, 'Error al actualizar responsable');
          this.setError(message);
          this.setLoading(false);
          return throwError(() => new Error(message));
        })
      )
      .subscribe({
        next: (res: Responsible) => {
          this._responsibles.update((list: Responsible[]) =>
            list.map((r: Responsible) => (r.id === id ? res : r))
          );
          this.setLoading(false);
        },
        error: () => {
          this.setLoading(false);
        },
      });
  }
}
