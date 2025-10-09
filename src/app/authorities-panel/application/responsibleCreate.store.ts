import { Injectable, signal, computed, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Responsible } from '../domain/model/responsibleCreate.entity';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResponsibleCreateStore {
  private readonly apiUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderResponsiblesEndpointPath}`;

  private readonly _responsibles = signal<Responsible[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly responsibles: Signal<Responsible[]> = this._responsibles.asReadonly();
  readonly loading: Signal<boolean> = this._loading.asReadonly();
  readonly error: Signal<string | null> = this._error.asReadonly();

  readonly count = computed<number>(() => this.responsibles().length);

  constructor(private readonly http: HttpClient) {
    this.loadResponsibles();
  }

  loadResponsibles(): void {
    this._loading.set(true);

    this.http.get<Responsible[]>(this.apiUrl).pipe(
      catchError((err: unknown) => {
        this._error.set('Error loading responsibles');
        console.error('❌ Error loading responsibles:', err);
        return of([] as Responsible[]);
      })
    ).subscribe({
      next: (data: Responsible[]) => {
        this._responsibles.set(data);
        this._loading.set(false);
      },
      error: (err: unknown) => {
        this._error.set('Unexpected error loading responsibles');
        console.error(err);
        this._loading.set(false);
      }
    });
  }

  addResponsible(responsible: Responsible): void {
    this._loading.set(true);

    this.http.post<Responsible>(this.apiUrl, responsible).pipe(
      catchError((err: unknown) => {
        this._error.set('Error creating responsible');
        console.error('❌ Error creating responsible:', err);
        return of(null as Responsible | null);
      })
    ).subscribe({
      next: (newResponsible: Responsible | null) => {
        if (newResponsible) {
          // 👇 Aquí se tipa explícitamente la lista
          this._responsibles.update((list: Responsible[]): Responsible[] => [
            ...list,
            newResponsible
          ]);
        }
        this._loading.set(false);
      },
      error: (err: unknown) => {
        this._error.set('Unexpected error creating responsible');
        console.error(err);
        this._loading.set(false);
      }
    });
  }
}
