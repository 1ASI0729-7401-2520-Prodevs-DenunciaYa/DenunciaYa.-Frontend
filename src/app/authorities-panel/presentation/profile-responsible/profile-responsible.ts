import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ResponsibleApiEndpoint } from '../../infrastructure/responsibleCreate-api--endpoint';
import { ActivatedRoute, Router } from '@angular/router';
import { Responsible } from '../../domain/model/responsibleCreate.entity';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-profile-responsible',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    MatIconModule,
    MatCardModule,
    MatButton
  ],
  templateUrl: './profile-responsible.html',
  styleUrls: ['./profile-responsible.css']
})
/**
 * @class ProfileResponsibleComponent
 * @constructor
 * @implements OnInit
 * @summary Component for displaying the profile of a responsible authority.
 * @method ngOnInit - Initializes the component and loads responsible data based on route parameters.
 * @method goBack - Navigates back to the complaint list view.
 */
export class ProfileResponsibleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private responsibleApi = inject(ResponsibleApiEndpoint);

  responsible: Responsible | null = null;
  loading = true;

  ngOnInit(): void {
    const responsibleId = this.route.snapshot.paramMap.get('id');



    if (!responsibleId) {
      this.loading = false;
      this.router.navigate(['/complaint-list']);
      return;
    }

    const cleanResponsibleId = responsibleId.replace('$', '').trim();

    this.responsible = this.responsibleApi.getResponsibleById(cleanResponsibleId);

    this.loading = false;

    if (!this.responsible) {
    }
  }

  goBack(): void {
    this.router.navigate(['/complaint-list']);
  }
}
