import { Injectable, signal, computed, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Responsible } from '../domain/model/responsibleCreate.entity';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ResponsibleAssembler } from '../infrastructure/responsibleCreate.assembler';
import { ResponsibleResource } from '../infrastructure/responsibleCreate.response';

/**
 * @class Responsible
 * @summary Manages the state and operations related to Responsible entities, including loading, adding, and updating responsibles.
 * @method loadResponsibles - Loads the list of responsibles from the API.
 * @method addResponsible - Adds a new responsible to the store and API.
 * @method updateResponsible - Updates an existing responsible in the store and API.
 * @property responsibles - Readonly signal of the list of responsibles.
 * @property loading - Readonly signal indicating loading state.
 * @property error - Readonly signal for error messages.
 * @property count - Computed property for the number of responsibles.
 */
@Injectable({ providedIn: 'root' })
export class ResponsibleCreateStore {
  private readonly apiUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderResponsiblesEndpointPath}`;
  private assembler = new ResponsibleAssembler();

  private readonly _responsibles = signal<Responsible[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly responsibles: Signal<Responsible[]> = this._responsibles.asReadonly();
  readonly loading: Signal<boolean> = this._loading.asReadonly();
  readonly error: Signal<string | null> = this._error.asReadonly();

  readonly count = computed(() => this._responsibles().length);

  constructor(private readonly http: HttpClient) {
    this.loadResponsibles();
  }

  loadResponsibles(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<ResponsibleResource[] | null | undefined>(this.apiUrl)
      .pipe(
        catchError(err => {
          this._error.set('Error loading responsibles');
          return of([] as ResponsibleResource[]);
        })
      )
      .subscribe(data => {
        const safeData: ResponsibleResource[] = Array.isArray(data) ? data : [];
        const responsibles = safeData.map(r => this.assembler.toEntityFromResource(r));
        this._responsibles.set(responsibles);
        this._loading.set(false);
      });
  }

  addResponsible(responsibleData: Omit<Responsible, 'id' | 'createdAt'>): void {
    this._loading.set(true);
    this._error.set(null);

    const newResponsible = new Responsible({
      id: Date.now().toString(),
      ...responsibleData,
      createdAt: new Date(),
    });

    const resource = this.assembler.toResourceFromEntity(newResponsible);

    this.http.post<ResponsibleResource>(this.apiUrl, resource)
      .pipe(
        catchError(err => {
          this._error.set('Error creating responsible');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          const added = this.assembler.toEntityFromResource(response);
          this._responsibles.update(list => [...list, added]);
        }
        this._loading.set(false);
      });
  }

  getResponsiblesForUI() {
    return this._responsibles().map(r => ({
      id: r.id,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      role: r.role,
      description: r.description,
      accessLevel: r.accessLevel,
      status: r.status,
      caseCount: r.getComplaintCount(),
      createdAt: r.createdAt,
    }));
  }

  updateResponsible(responsible: Responsible): void {
    this._loading.set(true);
    this._error.set(null);

    const resource = this.assembler.toResourceFromEntity(responsible);

    this.http.put<ResponsibleResource>(`${this.apiUrl}/${responsible.id}`, resource)
      .pipe(
        catchError(err => {
          this._error.set('Error updating responsible');
          this._responsibles.update(list =>
            list.map(r => r.id === responsible.id ? responsible : r)
          );
          this._loading.set(false);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          const updated = this.assembler.toEntityFromResource(response);
          this._responsibles.update(list =>
            list.map(r => r.id === updated.id ? updated : r)
          );
        }
        this._loading.set(false);
      });
  }

  updateResponsibleInStore(responsible: Responsible): void {
    this._responsibles.update(list =>
      list.map(r => r.id === responsible.id ? responsible : r)
    );
  }
}
