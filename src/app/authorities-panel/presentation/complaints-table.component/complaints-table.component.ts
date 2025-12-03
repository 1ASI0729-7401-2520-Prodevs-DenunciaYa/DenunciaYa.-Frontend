import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import { ComplaintsStore } from '../../../complaint-creation/application/complaints-store';

@Component({
  selector: 'app-complaints-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, TranslatePipe],
  templateUrl: './complaints-table.component.html',
  styleUrls: ['./complaints-table.component.css']
})
/**
 * @class ComplaintsTableComponent
 * @summary Component to display a table of complaints fetched from the store.
 */
export class ComplaintsTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'category', 'fecha', 'status', 'priority', 'detalles'];
  dataSource: any[] = [];

  private readonly store = inject(ComplaintsStore);

  constructor() {}

  ngOnInit(): void {
    // Usar la señal del store y actualizar la dataSource cuando cambie
    effect(() => {
      const complaints = this.store.complaints();
      this.dataSource = complaints.map((c, index) => ({
        id: c.id || index + 1,
        category: c.category,
        fecha: new Date(c.updateDate).toLocaleDateString(),
        status: c.status,
        priority: c.priority
      }));
    });
  }

  viewComplaint(row: any): void {
    alert(`Ver detalles de la denuncia: ${row.category}`);
  }
}
