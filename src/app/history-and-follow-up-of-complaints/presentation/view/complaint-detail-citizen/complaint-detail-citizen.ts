import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import { TimelineModule, TimelineItemModel } from '@syncfusion/ej2-angular-layouts';
import { MatButtonModule } from '@angular/material/button';

import {TranslatePipe} from '@ngx-translate/core';
import {Complaint} from '../../../../complaint-creation/domain/model/complaint.entity';
import {ComplaintsApiService} from '../../../../complaint-creation/infrastructure/complaint-api';
import {Responsible} from '../../../../authorities-panel/domain/model/responsibleCreate.entity';
import {ResponsibleApiEndpoint} from '../../../../authorities-panel/infrastructure/responsibleCreate-api--endpoint';

@Component({
  selector: 'app-complaint-detail-citizen',
  standalone: true,
  imports: [NgForOf, NgIf, TimelineModule, MatButtonModule, DatePipe, NgClass, TranslatePipe],
  templateUrl: './complaint-detail-citizen.html',
  styleUrls: ['./complaint-detail-citizen.css']
})
/**
 * @class ComplaintDetailAuthority
 * @summary Component for displaying detailed information about a complaint to authorities.
 * @description This component fetches and displays detailed information about a specific complaint,
 * @method ngOnInit Initializes the component and loads complaint data.
 * @method loadComplaint Loads complaint data from the API based on the route parameter.
 * @method generateTimeline Generates the timeline of status updates for the complaint.
 * @method acceptComplaint Accepts the complaint, updating its status and timeline.
 * @method rejectComplaint Rejects the complaint, updating its status and timeline.
 * @method advanceStatus Advances the complaint to the next status in the timeline.
 * @method resetComplaint Resets the complaint to its initial status and timeline.
 * @method deleteComplaint Deletes the complaint after user confirmation.
 * @method editComplaint Navigates to the complaint edit page.
 * @method canEditOrDelete Determines if the complaint can be edited or deleted based on its status.
 * @method canAdvanceStatus Determines if the complaint status can be advanced.
 * @method getStatusClass Returns the CSS class for a given complaint status.
 * @method getPriorityClass Returns the
 * @author Omar Harold Rivera Ticllacuri
 */
export class ComplaintDetailCitizen implements OnInit {
  complaint?: Complaint;
  assignedResponsible: Responsible | null = null;
  protected readonly title = signal('denunciaya-frontend');

  public orderStatus: TimelineItemModel[] = [];
  public showDecisionButtons = false;

  private statusMessages: {[key: string]: string} = {
    'Complaint registered': 'Awareness has been taken of the problem and preventive actions will begin.',
    'Under review': 'Your complaint is currently being processed by our team.',
    'Awaiting response': 'Your complaint is being processed, you will have a response soon.',
    'Decision pending': 'Your case is in the final evaluation process.',
    'Accepted': 'Your complaint has been accepted and is being processed.',
    'Rejected': 'We apologize for the inconvenience, but your complaint will be rejected due to lack of evidence.',
    'Completed': 'Your complaint has been completed. Thank you for your support. The residents of your city appreciate such a noble act.'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private complaintsService: ComplaintsApiService,
    private responsibleApi: ResponsibleApiEndpoint

  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.complaintsService.getComplaintById(id).subscribe({
        next: (data) => {


          this.complaint = data;
          this.generateTimeline();
          this.checkDecisionState();
          this.findAssignedResponsible();

        },
        error: (error) => {

        }
      });
    }
  }

  generateTimeline(): void {


    if (!this.complaint || !this.complaint.timeline) {
      return;
    }


    this.orderStatus = this.complaint.timeline.map(item => {

      let cssClass = 'state-default';

      if (item.completed) {
        if (item.status === 'Rejected') {
          cssClass = 'state-error';
        } else {
          cssClass = item.current ? 'state-info' : 'state-success';
        }
      } else if (item.waitingDecision) {
        cssClass = 'state-waiting';
      }

      const formattedDate = this.formatTimelineDate(new Date(item.date));



      return {
        content: item.status,
        oppositeContent: formattedDate,
        cssClass: cssClass
      };
    });

  }

  private checkDecisionState(): void {
    if (!this.complaint || !this.complaint.timeline) return;

    const currentIndex = this.complaint.timeline.findIndex(item => item.current);

    if (currentIndex !== -1 && currentIndex < this.complaint.timeline.length - 1) {
      const currentItem = this.complaint.timeline[currentIndex];
      const nextItem = this.complaint.timeline[currentIndex + 1];

      this.showDecisionButtons = currentItem.status === 'Awaiting response' &&
        nextItem.waitingDecision === true;
    } else {
      this.showDecisionButtons = false;
    }
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
    if (!this.complaint || !this.complaint.timeline) return;

    if (confirm('Are you sure you want to accept this complaint?')) {
      const currentIndex = this.complaint.timeline.findIndex(item => item.current);
      const decisionIndex = this.complaint.timeline.findIndex(item => item.waitingDecision);

      if (currentIndex !== -1 && decisionIndex !== -1) {
        this.complaint.timeline[currentIndex].completed = true;
        this.complaint.timeline[currentIndex].current = false;

        this.complaint.timeline[decisionIndex].completed = true;
        this.complaint.timeline[decisionIndex].current = false;
        this.complaint.timeline[decisionIndex].status = "Accepted";
        this.complaint.timeline[decisionIndex].waitingDecision = false;
        this.complaint.timeline[decisionIndex].date = new Date().toISOString();

        this.complaint.timeline[decisionIndex + 1].current = true;
        this.complaint.timeline[decisionIndex + 1].completed = true;
        this.complaint.timeline[decisionIndex + 1].date = new Date().toISOString();

        this.complaint.status = 'Completed';
        this.complaint.updateDate = new Date().toISOString();
        this.complaint.updateMessage = this.statusMessages['Accepted'];

        this.showDecisionButtons = false;
        this.saveComplaintChanges();
      }
    }
  }

  rejectComplaint(): void {
    if (!this.complaint || !this.complaint.timeline) return;

    if (confirm('Are you sure you want to reject this complaint?')) {
      const currentIndex = this.complaint.timeline.findIndex(item => item.current);
      const decisionIndex = this.complaint.timeline.findIndex(item => item.waitingDecision);

      if (currentIndex !== -1 && decisionIndex !== -1) {
        this.complaint.timeline[currentIndex].completed = true;
        this.complaint.timeline[currentIndex].current = false;

        this.complaint.timeline[decisionIndex].completed = true;
        this.complaint.timeline[decisionIndex].current = true;
        this.complaint.timeline[decisionIndex].status = "Rejected";
        this.complaint.timeline[decisionIndex].waitingDecision = false;
        this.complaint.timeline[decisionIndex].date = new Date().toISOString();

        this.complaint.timeline[decisionIndex + 1].completed = false;
        this.complaint.timeline[decisionIndex + 1].current = false;

        this.complaint.status = 'Rejected';
        this.complaint.updateDate = new Date().toISOString();
        this.complaint.updateMessage = this.statusMessages['Rejected'];

        this.showDecisionButtons = false;
        this.saveComplaintChanges();
      }
    }
  }

  advanceStatus(): void {
    if (!this.complaint || !this.complaint.timeline) return;

    const currentIndex = this.complaint.timeline.findIndex(item => item.current);

    if (currentIndex < this.complaint.timeline.length - 1) {
      this.complaint.timeline[currentIndex].completed = true;
      this.complaint.timeline[currentIndex].current = false;

      this.complaint.timeline[currentIndex + 1].current = true;

      if (!this.complaint.timeline[currentIndex + 1].waitingDecision) {
        this.complaint.timeline[currentIndex + 1].completed = true;
      }

      this.complaint.timeline[currentIndex + 1].date = new Date().toISOString();

      this.updateComplaintStatusFromTimeline();

      const newStatus = this.complaint.timeline[currentIndex + 1].status;
      this.complaint.updateDate = new Date().toISOString();
      this.complaint.updateMessage = this.statusMessages[newStatus] || `Status advanced to: ${newStatus}`;

      this.checkDecisionState();

      this.saveComplaintChanges();
    } else {
      alert('Complaint is already completed!');
    }
  }

  resetComplaint(): void {
    if (!this.complaint || !this.complaint.timeline) return;

    if (confirm('Reset complaint to initial status?')) {
      this.complaint.timeline.forEach((item, index) => {
        item.completed = index === 0;
        item.current = index === 0;

        if (index === 0) {
          item.date = "2025-10-07T20:09:00";
          item.status = "Complaint registered";
          item.waitingDecision = false;
        } else if (index === 1) {
          item.date = "2025-10-07T18:44:00";
          item.status = "Under review";
          item.waitingDecision = false;
        } else if (index === 2) {
          item.date = "2025-10-07T18:44:00";
          item.status = "Awaiting response";
          item.waitingDecision = false;
        } else if (index === 3) {
          item.date = "2025-10-07T20:19:00";
          item.status = "Decision pending";
          item.waitingDecision = true;
        } else {
          item.date = "2025-10-07T18:44:00";
          item.status = "Completed";
          item.waitingDecision = false;
        }
      });

      this.complaint.status = 'Pending';
      this.complaint.updateDate = new Date().toISOString();
      this.complaint.updateMessage = this.statusMessages['Complaint registered'];
      this.showDecisionButtons = false;

      this.saveComplaintChanges();
    }
  }

  private updateComplaintStatusFromTimeline(): void {
    if (!this.complaint || !this.complaint.timeline) return;

    const currentItem = this.complaint.timeline.find(item => item.current);
    if (currentItem) {
      const statusMap: {[key: string]: Complaint['status']} = {
        'Complaint registered': 'Pending',
        'Under review': 'Pending',
        'Awaiting response': 'Awaiting response',
        'Decision pending': 'Awaiting response',
        'Accepted': 'Completed',
        'Rejected': 'Rejected',
        'Completed': 'Completed'
      };

      this.complaint.status = statusMap[currentItem.status] || 'Pending';
    }
  }

  private saveComplaintChanges(): void {
    if (!this.complaint) return;

    this.complaintsService.updateComplaint(this.complaint).subscribe({
      next: (updatedComplaint) => {
        this.complaint = updatedComplaint;
        this.generateTimeline();
        alert('Status updated successfully!');
      },
      error: (error) => {
        alert('Error updating status');
      }
    });
  }

  deleteComplaint(): void {
    if (!this.complaint) return;

    if (confirm('Are you sure you want to delete this complaint?')) {
      this.complaintsService.deleteComplaint(this.complaint.id).subscribe(() => {
        alert('Complaint deleted successfully');
        this.router.navigate(['/complaints']);
      });
    }
  }

  editComplaint(): void {
    if (this.complaint) {
      this.router.navigate([`/complaints/edit/${this.complaint.id}`]);
    }
  }

  canEditOrDelete(): boolean {
    return this.complaint?.status === 'Pending' ||
      this.complaint?.status === 'Draft' ||
      this.complaint?.status === 'Awaiting response';
  }

  canAdvanceStatus(): boolean {
    if (!this.complaint || !this.complaint.timeline) return false;

    const currentIndex = this.complaint.timeline.findIndex(item => item.current);
    return currentIndex < this.complaint.timeline.length - 1 &&
      this.complaint.status !== 'Rejected' &&
      this.complaint.status !== 'Completed' &&
      !this.showDecisionButtons;
  }

  getStatusClass(status: string): string {
    if (!status) return 'status default';

    const normalized = status.toLowerCase().replace(' ', '-');
    switch (normalized) {
      case 'pending': return 'status pending';
      case 'accepted': return 'status accepted';
      case 'in-process': return 'status in-process';
      case 'completed': return 'status completed';
      case 'rejected': return 'status rejected';
      case 'draft': return 'status draft';
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
  private findAssignedResponsible(): void {
    if (!this.complaint || !this.complaint.assignedTo || this.complaint.assignedTo === 'Not assigned') {
      this.assignedResponsible = null;
      return;
    }

    this.assignedResponsible = this.responsibleApi.findResponsibleFromAssignedTo(this.complaint.assignedTo);

    if (this.assignedResponsible) {
    } else {
    }
  }

  viewResponsibleProfile(): void {
    if (this.assignedResponsible && this.assignedResponsible.id) {
      this.router.navigate(['/responsible-profile', this.assignedResponsible.id]);
    } else {
      alert('No responsible assigned or responsible information is incomplete');
    }
  }
  getCurrentStatusMessage(): string {
    if (!this.complaint) return '';

    const currentItem = this.complaint.timeline?.find(item => item.current);
    if (currentItem && currentItem.updateMessage) {
      return currentItem.updateMessage;
    }

    return this.complaint.updateMessage || this.statusMessages[this.complaint.status] || '';
  }


  isAssigned(): boolean {
    return this.complaint?.assignedTo !== 'Not assigned' &&
      this.complaint?.assignedTo !== '' &&
      this.complaint?.assignedTo !== undefined;
  }

  viewResponsibleInfo(): void {
    if (this.assignedResponsible && this.assignedResponsible.id) {
      this.router.navigate(['/responsible-profile', this.assignedResponsible.id]);
    } else {
      alert('No responsible assigned or responsible information is incomplete');
    }
  }

}
