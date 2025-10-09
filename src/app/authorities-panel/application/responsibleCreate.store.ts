import { Injectable, Signal, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { Responsible } from '../domain/model/responsibleCreate,entity';
import { ResponsibleApiEndpoint } from '../infrastructure/responsibleCreate-api--endpoint';

@Injectable({ providedIn: 'root' })
export class ResponsibleCreateStore {
  private readonly responsiblesSignal = signal<Responsible[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly responsibles = this.responsiblesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly responsibleCount = computed(() => this.responsibles().length);

  constructor(private readonly responsibleApi: ResponsibleApiEndpoint) {
    this.loadResponsibles();
  }

  loadResponsibles(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.responsibleApi
      .getAll()
      .pipe(takeUntilDestroyed(), retry(2))
      .subscribe({
        next: (responsibles: Responsible[]) => {
          this.responsiblesSignal.set(responsibles);
          this.loadingSignal.set(false);
        },
        error: (err: any) => {
          this.errorSignal.set(this.formatError(err, 'Error al cargar responsables'));
          this.loadingSignal.set(false);
        },
      });
  }

  addResponsible(responsible: Responsible): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.responsibleApi
      .create(responsible)
      .pipe(retry(2))
      .subscribe({
        next: (created: Responsible) => {
          this.responsiblesSignal.update((list: Responsible[]) => [...list, created]);
          this.loadingSignal.set(false);
        },
        error: (err: any) => {
          this.errorSignal.set(this.formatError(err, 'Error al crear responsable'));
          this.loadingSignal.set(false);
        },
      });
  }

  deleteResponsible(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.responsibleApi
      .delete(id)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.responsiblesSignal.update((list: Responsible[]) => list.filter((r: Responsible) => r.id !== id));
          this.loadingSignal.set(false);
        },
        error: (err: any) => {
          this.errorSignal.set(this.formatError(err, 'Error al eliminar responsable'));
          this.loadingSignal.set(false);
        },
      });
  }

  getResponsibleById(id: number | null | undefined): Signal<Responsible | undefined> {
    return computed(() => (id ? this.responsibles().find((r: Responsible) => r.id === id) : undefined));
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error)
      return error.message.includes('Resource not found')
        ? `${fallback}: no encontrado`
        : error.message;
    return fallback;
  }
}
