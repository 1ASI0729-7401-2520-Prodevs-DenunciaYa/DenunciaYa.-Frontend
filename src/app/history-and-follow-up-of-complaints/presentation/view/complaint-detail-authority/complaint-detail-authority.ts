import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { TimelineModule, TimelineItemModel } from '@syncfusion/ej2-angular-layouts';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { ComplaintsApiService } from '../../../../complaint-creation/infrastructure/complaint-api';
import { Complaint } from '../../../../complaint-creation/domain/model/complaint.entity';
import { ResponsibleApiEndpoint } from '../../../../authorities-panel/infrastructure/responsibleCreate-api--endpoint';
import { Responsible } from '../../../../authorities-panel/domain/model/responsibleCreate.entity';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-complaint-detail-authority',
  imports: [
    NgForOf,
    TimelineModule,
    DatePipe,
    MatButton,
    NgIf,
    NgClass,
    TranslatePipe,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './complaint-detail-authority.html',
  styleUrl: './complaint-detail-authority.css'
})
export class ComplaintDetailAuthority implements OnInit {
  complaint?: Complaint;
  assignedResponsible: Responsible | null = null;
  protected readonly title = signal('denunciaya-frontend');

  public orderStatus: TimelineItemModel[] = [];
  public showDecisionButtons = false;

  private statusMessages: {[key: string]: string} = {
    'Pending': 'Awareness has been taken of the problem and preventive actions will begin.',
    'In Process': 'Your complaint is currently being processed by our team.',
    'Awaiting Response': 'Your complaint is being processed, you will have a response soon.',
    'Completed': 'Your complaint has been completed. Thank you for your support.',
    'Rejected': 'We apologize for the inconvenience, but your complaint has been rejected.'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private complaintsService: ComplaintsApiService,
    private responsibleApi: ResponsibleApiEndpoint
  ) {}

  ngOnInit(): void {
    this.loadComplaint();
  }

  private loadComplaint(): void {
    const complaintId = this.route.snapshot.paramMap.get('id');

    if (complaintId) {
      this.complaintsService.getComplaintById(complaintId).subscribe({
        next: (complaint) => {
          this.complaint = complaint;
          this.generateTimeline();
          this.checkDecisionState();
          this.findAssignedResponsible();
        },
        error: (error) => {
          alert('Error loading complaint details');
          this.router.navigate(['/complaints']);
        }
      });
    } else {
      this.router.navigate(['/complaints']);
    }
  }

  private findAssignedResponsible(): void {
    if (!this.complaint || !this.complaint.assignedTo || this.complaint.assignedTo === 'Not assigned') {
      this.assignedResponsible = null;
      return;
    }

    this.assignedResponsible = this.responsibleApi.findResponsibleFromAssignedTo(this.complaint.assignedTo);
  }

  generateTimeline(): void {
    if (!this.complaint || !this.complaint.timeline) return;

    // Ordenar timeline cronológicamente
    this.complaint.timeline = [...this.complaint.timeline].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return da - db;
    });

    this.orderStatus = this.complaint.timeline.map(item => {
      let cssClass = 'state-default';

      if (item.completed) {
        if (item.status === 'Rejected') {
          cssClass = 'state-error';
        } else if (item.current) {
          cssClass = 'state-info';
        } else {
          cssClass = 'state-success';
        }
      } else if (item.waitingDecision) {
        cssClass = 'state-waiting';
      }

      const formattedDate = item.date ? this.formatTimelineDate(new Date(item.date)) : '';

      return {
        content: item.status,
        oppositeContent: formattedDate,
        cssClass: cssClass
      };
    });
  }

  private checkDecisionState(): void {
    if (!this.complaint) return;

    // Mostrar botones de decisión solo si el estado es "Awaiting Response"
    this.showDecisionButtons = this.complaint.status === 'Awaiting response';
  }

  private formatTimelineDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };

    const timeString = date.toLocaleTimeString('en-US', options);
    const dateString = date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    return `${timeString} · ${dateString}`;
  }

  acceptComplaint(): void {
    if (!this.complaint) return;

    if (confirm('Are you sure you want to accept this complaint?')) {
      this.complaintsService.acceptDecision(this.complaint.id).subscribe({
        next: (updatedComplaint) => {
          this.complaint = updatedComplaint;
          this.generateTimeline();
          this.checkDecisionState();
          alert('Complaint accepted successfully!');
        },
        error: (error) => {
          alert('Error accepting complaint');
          console.error(error);
        }
      });
    }
  }

  rejectComplaint(): void {
    if (!this.complaint) return;

    if (confirm('Are you sure you want to reject this complaint?')) {
      this.complaintsService.rejectDecision(this.complaint.id).subscribe({
        next: (updatedComplaint) => {
          this.complaint = updatedComplaint;
          this.generateTimeline();
          this.checkDecisionState();
          alert('Complaint rejected successfully!');
        },
        error: (error) => {
          alert('Error rejecting complaint');
          console.error(error);
        }
      });
    }
  }

  advanceStatus(): void {
    if (!this.complaint) return;

    // Verificar si puede avanzar
    if (!this.canAdvanceStatus()) {
      alert('Cannot advance status from current state!');
      return;
    }

    this.complaintsService.advanceTimeline(this.complaint.id).subscribe({
      next: (updatedComplaint) => {
        this.complaint = updatedComplaint;
        this.generateTimeline();
        this.checkDecisionState();
        alert('Status advanced successfully!');
      },
      error: (error) => {
        alert('Error advancing status');
        console.error(error);
      }
    });
  }

  resetComplaint(): void {
    if (!this.complaint) return;

    if (confirm('Reset complaint to initial status?')) {
      // Usar el endpoint de update status para resetear a PENDING
      this.complaintsService.updateComplaintStatus(this.complaint.id, 'Pending').subscribe({
        next: (updatedComplaint) => {
          this.complaint = updatedComplaint;
          this.generateTimeline();
          this.checkDecisionState();
          alert('Complaint reset to initial status!');
        },
        error: (error) => {
          alert('Error resetting complaint');
          console.error(error);
        }
      });
    }
  }

  deleteComplaint(): void {
    if (!this.complaint) return;

    if (confirm('Are you sure you want to delete this complaint?')) {
      this.complaintsService.deleteComplaint(this.complaint.id).subscribe(() => {
        alert('Complaint deleted successfully');
        this.router.navigate(['/complaint-list']);
      });
    }
  }

  editComplaint(): void {
    if (this.complaint) {
      this.router.navigate([`/complaint-edit/${this.complaint.id}`]);
    }
  }

  canEditOrDelete(): boolean {
    return this.complaint?.status === 'Pending' ||
      this.complaint?.status === 'Awaiting response';
  }

  canAdvanceStatus(): boolean {
    if (!this.complaint) return false;

    const currentStatus = this.complaint.status;

    // Puede avanzar si el estado no es final (Completed o Rejected)
    return currentStatus !== 'Completed' &&
      currentStatus !== 'Rejected' &&
      !this.showDecisionButtons; // No avanzar si está esperando decisión
  }

  getStatusClass(status: string): string {
    if (!status) return 'status default';

    const normalized = status.toLowerCase().replace(' ', '-');
    switch (normalized) {
      case 'pending': return 'status pending';
      case 'in-process': return 'status in-process';
      case 'completed': return 'status completed';
      case 'rejected': return 'status rejected';
      case 'awaiting-response': return 'status awaiting';
      default: return 'status default';
    }
  }

  getPriorityClass(priority: string): string {
    if (!priority) return 'priority standard';

    const normalized = priority.toLowerCase();
    switch (normalized) {
      case 'standard': return 'priority standard';
      case 'urgent': return 'priority urgent';
      case 'critical': return 'priority critical';
      default: return 'priority standard';
    }
  }

  getCurrentStatusMessage(): string {
    if (!this.complaint) return '';

    // Buscar mensaje del timeline item actual
    const currentItem = this.complaint.timeline?.find(item => item.current);
    if (currentItem && currentItem.updateMessage) {
      return currentItem.updateMessage;
    }

    // Usar mensaje por defecto basado en el estado
    return this.complaint.updateMessage ||
      this.statusMessages[this.complaint.status] ||
      'Status information not available';
  }

  isAssigned(): boolean {
    return this.complaint?.assignedTo !== 'Not assigned' &&
      this.complaint?.assignedTo !== '' &&
      this.complaint?.assignedTo !== undefined;
  }

  viewResponsibleProfile(): void {
    if (this.assignedResponsible && this.assignedResponsible.id) {
      this.router.navigate(['/responsible-profile', this.assignedResponsible.id]);
    } else {
      alert('No responsible assigned or responsible information is incomplete');
    }
  }
}
