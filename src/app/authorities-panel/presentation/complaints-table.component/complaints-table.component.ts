import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-complaints-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, TranslatePipe],
  templateUrl: './complaints-table.component.html',
  styleUrls: ['./complaints-table.component.css']
})
/**
 * @class ComplaintsTableComponent
 * @summary Component to display a table of complaints fetched from an API.
 * @implements OnInit
 * @constructor
 * @method ngOnInit - Lifecycle hook to initialize the component and load complaints.
 * @method loadComplaints - Fetches complaints from the API and populates the data source.
 * @method viewComplaint - Displays details of a selected complaint.
 */
export class ComplaintsTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'category', 'fecha', 'status', 'priority', 'detalles'];
  dataSource: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    const apiUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderComplaintsEndpointPath}`;

    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.dataSource = data.map((c, index) => ({
          id: c.id || index + 1,
          category: c.category,
          fecha: new Date(c.updateDate).toLocaleDateString(),
          status: c.status,
          priority: c.priority
        }));
      },
    });
  }

  viewComplaint(row: any): void {
    alert(`Ver detalles de la denuncia: ${row.category}`);
  }
}
