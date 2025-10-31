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
import {AuthService} from '../../../../authentication-and-account-management/infrastructure/auth.service';
import {MatTooltipModule} from '@angular/material/tooltip';

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
    TranslatePipe,
    MatTooltipModule
  ],
  templateUrl: './complaint-list.html',
  styleUrl: './complaint-list.css'
})
/**
 * @class ComplaintList
 * @summary Component for displaying a list of complaints.
 * @constructor
 * @param {ComplaintsStore} store - Store for managing complaints.
 * @param {Router} router - Router for navigation.
 * @param {AuthService} authService - Service for authentication and user information.
 * @method viewComplaintDetail - Navigates to the complaint detail view.
 * @param {string} complaintId - The ID of the complaint to view.
 * @method editComplaint - Navigates to the complaint edit view.
 * @param {string} complaintId - The ID of the complaint to edit.
 * @method deleteComplaint - Deletes a complaint.
 * @param {string} id - The ID of the complaint to delete.
 * @method canDeleteComplaint - Checks if the current user can delete a complaint based on its status.
 * @param {Complaint} complaint - The complaint to check.
 * @return {boolean} True if the user can delete the complaint, false otherwise.
 * @method canShowEditButton - Checks if the edit button should be shown based on the user's role.
 * @return {boolean} True if the edit button should be shown, false otherwise.
 * @method getDeleteButtonTooltip - Gets the tooltip text for the delete button based on the complaint's status and user role.
 * @param {Complaint} complaint - The complaint to get the tooltip for.
 * @return {string} The tooltip text for the delete button.
 * @method viewComplaintDetails - Navigates to the appropriate complaint detail view based on user role.
 * @param {string} complaintId - The ID of the complaint to view.
 * @return {void}
 */
export class ComplaintList {
  readonly store = inject(ComplaintsStore);
  protected router = inject(Router);
  private authService = inject(AuthService);

  displayedColumns: string[] = ['id', 'category', 'updateDate', 'status', 'evolution', 'actions'];
  dataSource: Complaint[] = [];
  isCitizen: boolean = false;
  userRole: "citizen" | "authority" | "responsibles" | null = null;

  constructor() {
    effect(() => {
      this.dataSource = this.store.complaints();
    });

    this.checkUserRole();
  }

  private checkUserRole(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || null;
    this.isCitizen = this.userRole === 'citizen';
  }


  viewComplaintDetail(complaintId: string): void {
    this.router.navigate([`/complaint-detail/${complaintId}`]);
  }


  editComplaint(complaintId: string): void {
    this.router.navigate([`/complaints/edit/${complaintId}`]);
  }


  deleteComplaint(id: string) {
    this.store.deleteComplaint(id);
  }


  canDeleteComplaint(complaint: Complaint): boolean {
    if (!this.isCitizen) {
      return true;
    }

    const allowedStatuses = ['Pending', 'Under review'];
    return allowedStatuses.includes(complaint.status);
  }


  canShowEditButton(): boolean {
    return this.userRole === 'authority' || this.userRole === 'responsibles';
  }


  getDeleteButtonTooltip(complaint: Complaint): string {
    if (this.isCitizen && !this.canDeleteComplaint(complaint)) {
      return 'Solo puedes eliminar denuncias en estado Pendiente o En revisión';
    }
    return 'Eliminar denuncia';
  }
  viewComplaintDetails(complaintId: string) {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser?.role === 'citizen') {
      this.router.navigate(['/complaint-detail-citizen', complaintId]);
    } else {
      this.router.navigate(['/complaint-detail', complaintId]);
    }
  }

}
