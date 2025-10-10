import { Injectable, signal, computed, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Responsible } from '../domain/model/responsibleCreate.entity';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {ResponsibleAssembler} from '../infrastructure/responsibleCreate.assembler';

interface ApiResponsible {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  description: string[];
  accessLevel: string;
  createdAt: string;
  caseCount?: number;
}

@Injectable({ providedIn: 'root' })
export class ResponsibleCreateStore {
  private readonly apiUrl = 'https://denunciaya-fakeapi.onrender.com/responsibles';
  private assembler = new ResponsibleAssembler();

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
    this._error.set(null);

    this.http.get<ApiResponsible[]>(this.apiUrl).pipe(
      catchError((err: unknown) => {
        this._error.set('Error loading responsibles');
        console.error('❌ Error loading responsibles:', err);
        return of([] as ApiResponsible[]);
      })
    ).subscribe({
      next: (data: ApiResponsible[]) => {
        // ✅ Usar el assembler para transformar los datos
        const responsibles = data.map(item =>
          this.assembler.toEntityFromResource({
            id: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            phone: item.phone,
            role: item.role,
            description: item.description || [],
            accessLevel: item.accessLevel,
            createdAt: item.createdAt
          })
        );

        this._responsibles.set(responsibles);
        this._loading.set(false);
      },
      error: (err: unknown) => {
        this._error.set('Unexpected error loading responsibles');
        console.error(err);
        this._loading.set(false);
      }
    });
  }

  addResponsible(responsibleData: Omit<Responsible, 'id' | 'createdAt'>): void {
    this._loading.set(true);
    this._error.set(null);

    const newResponsible = new Responsible({
      id: Date.now(), // ID temporal
      ...responsibleData,
      createdAt: new Date()
    });

    const resource = this.assembler.toResourceFromEntity(newResponsible);

    this.http.post<ApiResponsible>(this.apiUrl, resource).pipe(
      catchError((err: unknown) => {
        this._error.set('Error creating responsible');
        console.error('❌ Error creating responsible:', err);
        return of(null);
      })
    ).subscribe({
      next: (response: ApiResponsible | null) => {
        if (response) {
          const newResponsible = this.assembler.toEntityFromResource(response);
          this._responsibles.update((list: Responsible[]) => [...list, newResponsible]);
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

  // ✅ Nuevo método para obtener responsables formateados para la UI
  getResponsiblesForUI() {
    return this.responsibles().map(responsible => ({
      id: responsible.id,
      firstName: responsible.firstName,
      lastName: responsible.lastName,
      email: responsible.email,
      phone: responsible.phone,
      category: responsible.role,
      caseCount: 0, // Puedes agregar lógica para calcular esto
      role: responsible.role,
      description: responsible.description,
      accessLevel: responsible.accessLevel,
      createdAt: responsible.createdAt
    }));
  }
}
