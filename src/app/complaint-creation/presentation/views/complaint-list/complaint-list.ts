import {Component, inject} from '@angular/core';
import {ComplaintsStore} from '../../../application/complaints-store';
import {Router} from '@angular/router';
import { effect } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatButton, MatIconButton} from '@angular/material/button';
import {DatePipe, NgClass} from '@angular/common';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {Complaint} from '../../../domain/model/complaint.entity';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-complaint-list',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatButton,
    DatePipe,
    MatIconButton,
    NgClass,
    MatIcon,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    TranslatePipe
  ],
  templateUrl: './complaint-list.html',
  styleUrl: './complaint-list.css'
})
export class ComplaintList {
  readonly store = inject(ComplaintsStore);
  protected router = inject(Router);

  displayedColumns: string[] = ['id', 'category', 'updateDate', 'status', 'evolution', 'actions'];
  dataSource: Complaint[] = [];

  constructor() {
    effect(() => {
      this.dataSource = this.store.complaints();
    });
  }

  /**
   * ✅ Navega a la página de detalle de la denuncia (solo ver información)
   */
  viewComplaintDetail(complaintId: string): void {
    this.router.navigate([`/complaint-detail/${complaintId}`]);
  }

  /**
   * ✅ Navega directamente a la página de EDICIÓN de la denuncia
   */
  editComplaint(complaintId: string): void {
    this.router.navigate([`/complaints/edit/${complaintId}`]); // ✅ Ruta corregida
  }

  /**
   * ✅ Elimina la denuncia
   */
  deleteComplaint(id: string) {
    this.store.deleteComplaint(id);
  }
}
