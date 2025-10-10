import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './team-management.html',
  styleUrls: ['./team-management.css']
})
export class TeamManagementComponent implements OnInit {
  private http = inject(HttpClient);

  responsibles: any[] = [];
  filteredResponsibles: any[] = []; // ✅ Agregamos esta propiedad

  readonly apiUrl = 'https://denunciaya-fakeapi.onrender.com/responsibles';

  ngOnInit(): void {
    this.loadResponsibles();
  }


  loadResponsibles() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        // ✅ Mapeo correcto de los datos de la API
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
      error: (err) => console.error('Error al cargar responsables:', err)
    });
  }

  assignComplaint(responsible: any) {
    console.log(`Asignando denuncia a ${responsible.firstName} ${responsible.lastName}`);
  }
}
