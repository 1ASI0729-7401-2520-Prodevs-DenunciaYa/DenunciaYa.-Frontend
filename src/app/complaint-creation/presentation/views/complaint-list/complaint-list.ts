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
    MatRowDef
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

  deleteComplaint(id: string) {
    this.store.deleteComplaint(id);
  }

}
