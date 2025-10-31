import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './team-management.html',
  styleUrls: ['./team-management.css']
})
/**
 * @class TeamManagementComponent
 * @constructor
 * @implements OnInit
 * @summary Component for managing the team of responsibles.
 * @method ngOnInit - Lifecycle hook that initializes the component and loads responsibles.
 * @method loadResponsibles - Loads the list of responsibles from the API.
 * @method assignComplaint - Assigns a complaint to a selected responsible.
 */
export class TeamManagementComponent implements OnInit {
  private http = inject(HttpClient);

  responsibles: any[] = [];
  filteredResponsibles: any[] = [];

  readonly apiUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderResponsiblesEndpointPath}`;

  ngOnInit(): void {
    this.loadResponsibles();
  }

  loadResponsibles() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.responsibles = data.map(r => ({
          id: r.id,
          firstName: r.firstName || r.name?.split(' ')[0] || 'N/A',
          lastName: r.lastName || r.name?.split(' ').slice(1).join(' ') || 'N/A',
          email: r.email || '-',
          phone: r.phone || '-',
          category: r.role || r.category || 'Unassigned',
          caseCount: r.caseCount ?? 0,
          role: r.role || 'Unassigned',
          description: r.description || [],
          accessLevel: r.accessLevel || 'basic',
          createdAt: r.createdAt
        }));

        this.filteredResponsibles = [...this.responsibles];
      },
    });
  }

  assignComplaint(responsible: any) {
  }
}
