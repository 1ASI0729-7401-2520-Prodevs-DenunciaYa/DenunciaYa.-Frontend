import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-complaints-table.component',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './complaints-table.component.html',
  styleUrl: './complaints-table.component.css'
})
export class ComplaintsTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'categoria', 'fecha', 'estado', 'prioridad'];
  dataSource: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.http.get<any[]>('http://localhost:3000/api/v1/complaints').subscribe({
      next: (data) => this.dataSource = data,
      error: (err) => console.error('Error loading complaints:', err)
    });
  }
}
