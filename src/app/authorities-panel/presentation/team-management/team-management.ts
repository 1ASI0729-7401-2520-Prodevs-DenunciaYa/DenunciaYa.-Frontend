import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-management.html',
  styleUrls: ['./team-management.css']
})
export class TeamManagementComponent implements OnInit {
  private http = inject(HttpClient);

  responsibles: any[] = [];
  filteredResponsibles: any[] = []; // ✅ Agregamos esta propiedad

  readonly apiUrl = 'http://localhost:3000/api/v1/responsibles';

  ngOnInit(): void {
    this.loadResponsibles();
  }

  loadResponsibles() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.responsibles = data.map(r => ({
          ...r,
          category: r.role || 'Unassigned',
          caseCount: r.caseCount ?? 0
        }));

        // ✅ Inicialmente la lista filtrada es igual a la completa
        this.filteredResponsibles = [...this.responsibles];
      },
      error: (err) => console.error('Error al cargar responsables:', err)
    });
  }

  assignComplaint(responsible: any) {
    console.log(`Asignando denuncia a ${responsible.firstName} ${responsible.lastName}`);
  }
}
