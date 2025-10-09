
import { computed, inject, Injectable, signal } from '@angular/core';
import { DirectoryApiService } from '../infrastructure/directory-api.service';
import { DirectoryEntity } from '../domain/model/directory.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';


export interface DirectoryState {
  entities: DirectoryEntity[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class DirectoryStore {
  private directoryService = inject(DirectoryApiService);

  private initialState: DirectoryState = {
    entities: [],
    loading: false,
    error: null,
  };

  // Creamos la señal principal que contendrá todo el estado
  private readonly state = signal(this.initialState);

  // Creamos "selectores" para acceder a partes específicas del estado
  readonly entities = computed(() => this.state().entities);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  constructor() {
    this.loadEntities(); // Llamamos al método de carga al iniciar el store
  }

  // Método para cargar las entidades desde la API
  loadEntities() {
    this.state.update((state) => ({ ...state, loading: true }));

    this.directoryService
      .getAll()
      .pipe(
        takeUntilDestroyed(),
        catchError((err) => {
          this.state.update((state) => ({ ...state, error: err.message }));
          return EMPTY;
        })
      )
      .subscribe((entities) => {
        this.state.update((state) => ({
          ...state,
          entities: entities,
          loading: false,
        }));
      });
  }
}
