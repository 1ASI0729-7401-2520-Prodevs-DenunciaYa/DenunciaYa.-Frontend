import { Component, inject, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ResponsibleCreateStore } from '../../application/responsibleCreate.store';
import { Responsible } from '../../domain/model/responsibleCreate.entity';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-profile-responsible',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile-responsible.html',
  styleUrls: ['./profile-responsible.css']
})
export class ProfileResponsibleComponent {
  private readonly store: ResponsibleCreateStore = inject(ResponsibleCreateStore);

  readonly responsibles: Signal<Responsible[]> = this.store.responsibles;
  readonly loading: Signal<boolean> = this.store.loading;
  readonly error: Signal<string | null> = this.store.error;

  readonly latestResponsible = computed<Responsible | null>(() => {
    const list = this.responsibles();
    return list.length > 0 ? list[list.length - 1] : null;
  });
}
