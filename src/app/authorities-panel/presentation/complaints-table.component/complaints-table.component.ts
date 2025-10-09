import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-complaints-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './complaints-table.component.html',
  styleUrls: ['./complaints-table.component.css']
})
export class ComplaintsTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'category', 'fecha', 'status', 'priority', 'detalles'];
  dataSource: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.http.get<any[]>('http://localhost:3000/api/v1/complaints').subscribe({
      next: (data) => {
        // En este caso "data" ya es el array de denuncias
        this.dataSource = data.map((c, index) => ({
          id: c.id || index + 1,
          category: c.category,
          fecha: new Date(c.updateDate).toLocaleDateString(),
          status: c.status,
          priority: c.priority
        }));
      },
      error: (err) => console.error('Error al cargar denuncias:', err)
    });
  }

  viewComplaint(row: any): void {
    alert(`Ver detalles de la denuncia: ${row.category}`);
  }
}
