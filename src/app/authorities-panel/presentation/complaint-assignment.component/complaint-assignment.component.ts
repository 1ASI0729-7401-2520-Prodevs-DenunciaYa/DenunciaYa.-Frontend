import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClient } from '@angular/common/http';
import {TranslatePipe} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {Complaint} from '../../../complaint-creation/domain/model/complaint.entity';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  assignedComplaints: string[]; // IDs de quejas asignadas
  specialization: string[];
  workload: number;
}

interface Assignment {
  id: string;
  complaintId: string;
  responsibleId: string;
  assignedDate: string;
  assignedBy: string;
  status: 'active' | 'completed' | 'reassigned';
}

// Interfaz separada para el miembro del equipo con quejas completas
interface TeamMemberWithComplaints {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  assignedComplaintIds: string[]; // IDs de quejas asignadas
  specialization: string[];
  workload: number;
  currentAssignments: Assignment[];
  assignedComplaints: Complaint[]; // Objetos Complaint completos
  availableComplaints: Complaint[];
}

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule,
    MatBadgeModule,
    MatProgressBarModule,
    TranslatePipe
  ],
  templateUrl: './complaint-assignment.component.html',
  styleUrls: ['./complaint-assignment.component.css']
})
export class ComplaintAssigmentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private http = inject(HttpClient);
  private router = inject(Router);

  private teamMembersSignal = signal<TeamMember[]>([]);
  private complaintsSignal = signal<Complaint[]>([]);
  private assignmentsSignal = signal<Assignment[]>([]);
  loading = signal<boolean>(false);
  selectedAssignments = signal<Map<string, string>>(new Map());

  departmentFilter = signal<string>('');
  statusFilter = signal<string>('');
  priorityFilter = signal<string>('');

  private readonly baseUrl = 'http://localhost:3000';

  readonly teamMembers = this.teamMembersSignal.asReadonly();
  readonly complaints = this.complaintsSignal.asReadonly();
  readonly assignments = this.assignmentsSignal.asReadonly();

  readonly activeAssignments = computed(() =>
    this.assignments().filter(a => a.status === 'active')
  );

  readonly teamStats = computed(() => {
    const members = this.teamMembers();
    return {
      totalMembers: members.length,
      availableMembers: members.filter(m => m.status === 'available').length,
      busyMembers: members.filter(m => m.status === 'busy').length,
      totalComplaints: this.complaints().length
    };
  });

  readonly departments = computed(() => {
    const departments = this.teamMembers().map(m => m.department);
    return [...new Set(departments)].sort();
  });

  readonly priorities = computed(() => {
    const priorities = this.complaints().map(c => c.priority);
    return [...new Set(priorities)].sort();
  });

  teamMembersWithAssignments = computed(() => {
    const members = this.teamMembers();
    const assignments = this.activeAssignments();
    const complaints = this.complaints();

    let filteredMembers = members;

    if (this.departmentFilter()) {
      filteredMembers = filteredMembers.filter(m =>
        m.department === this.departmentFilter()
      );
    }

    return filteredMembers.map(member => {
      const memberAssignments = assignments.filter(a => a.responsibleId === member.id);
      const assignedComplaints = memberAssignments.map(assignment =>
        complaints.find(c => c.id === assignment.complaintId)
      ).filter(Boolean) as Complaint[];

      const assignedComplaintIds = assignedComplaints.map(c => c.id);
      const availableComplaints = this.getAvailableComplaintsForMember(member);

      const teamMemberWithComplaints: TeamMemberWithComplaints = {
        ...member,
        assignedComplaintIds: assignedComplaintIds,
        currentAssignments: memberAssignments,
        assignedComplaints: assignedComplaints,
        availableComplaints: availableComplaints,
        workload: this.calculateWorkload(member, assignedComplaints.length)
      };

      return teamMemberWithComplaints;
    });
  });

  assignmentForm: FormGroup;
  filterForm: FormGroup;
  displayedColumns: string[] = ['teamMember', 'status', 'workload', 'assignedComplaints', 'availableComplaints', 'actions'];

  constructor() {
    this.assignmentForm = this.fb.group({
      complaintId: [''],
      teamMemberId: ['']
    });

    this.filterForm = this.fb.group({
      department: [''],
      status: [''],
      priority: ['']
    });
  }

  ngOnInit(): void {
    this.loadAllData();

    this.filterForm.valueChanges.subscribe(values => {
      this.departmentFilter.set(values.department || '');
      this.statusFilter.set(values.status || '');
      this.priorityFilter.set(values.priority || '');
    });
  }

  private loadAllData(): void {
    this.loading.set(true);

    Promise.all([
      this.loadTeamMembers(),
      this.loadComplaints(),
      this.loadAssignments()
    ]).finally(() => {
      this.loading.set(false);
    });
  }

  getDisplayedColumns(): string[] {
    const screenWidth = window.innerWidth;

    if (screenWidth < 480) {
      return ['teamMember', 'workload', 'actions'];
    } else if (screenWidth < 768) {
      return ['teamMember', 'workload', 'availableComplaints', 'actions'];
    } else if (screenWidth < 1024) {
      return ['teamMember', 'status', 'workload', 'availableComplaints', 'actions'];
    } else {
      return ['teamMember', 'status', 'workload', 'assignedComplaints', 'availableComplaints', 'actions'];
    }
  }

  private loadTeamMembers(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<any[]>(`${this.baseUrl}/responsibles`).subscribe({
        next: (members) => {
          const teamMembers: TeamMember[] = members.map(member => ({
            id: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            department: member.department,
            position: member.position || 'Team Member',
            email: member.email || `${member.firstName.toLowerCase()}.${member.lastName.toLowerCase()}@example.com`,
            phone: member.phone || '+51 999 999 999',
            status: this.getRandomStatus(),
            assignedComplaints: member.assignedComplaints || [],
            specialization: [member.department],
            workload: Math.floor(Math.random() * 100)
          }));
          this.teamMembersSignal.set(teamMembers);
          resolve();
        },
        error: (error) => {
          this.showMessage('Error loading team members', 'error');
          resolve();
        }
      });
    });
  }

  private loadComplaints(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<any[]>(`${this.baseUrl}/complaints`).subscribe({
        next: (complaints) => {
          const complaintEntities: Complaint[] = complaints.map(complaint => {
            // Crear una nueva instancia de Complaint sin prefijos de guión bajo
            return new Complaint({
              id: complaint.id,
              category: complaint.category,
              department: complaint.department,
              city: complaint.city,
              district: complaint.district,
              location: complaint.location,
              referenceInfo: complaint.referenceInfo,
              description: complaint.description,
              status: complaint.status,
              priority: complaint.priority,
              evidence: complaint.evidence || [],
              assignedTo: complaint.assignedTo,
              updateMessage: complaint.updateMessage || '',
              updateDate: complaint.updateDate,
              timeline: complaint.timeline || [],
              responsibleId: complaint.responsibleId
            });
          });
          this.complaintsSignal.set(complaintEntities);
          resolve();
        },
        error: (error) => {
          this.showMessage('Error loading complaints', 'error');
          resolve();
        }
      });
    });
  }

  private loadAssignments(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<Assignment[]>(`${this.baseUrl}/complaintAssignments`).subscribe({
        next: (assignments) => {
          this.assignmentsSignal.set(assignments);
          resolve();
        },
        error: (error) => {
          this.showMessage('Error loading assignments', 'error');
          resolve();
        }
      });
    });
  }

  private getRandomStatus(): 'available' | 'busy' | 'offline' {
    const statuses = ['available', 'busy', 'offline'];
    return statuses[Math.floor(Math.random() * statuses.length)] as any;
  }

  getAvailableComplaintsForMember(member: TeamMember): Complaint[] {
    const unassignedComplaints = this.complaints().filter(complaint =>
      !complaint.responsibleId &&
      member.specialization.some(spec =>
        complaint.category.toLowerCase().includes(spec.toLowerCase()) ||
        spec.toLowerCase().includes(complaint.category.toLowerCase())
      )
    );

    if (this.priorityFilter()) {
      return unassignedComplaints.filter(c => c.priority === this.priorityFilter());
    }

    return unassignedComplaints;
  }

  calculateWorkload(member: TeamMember, assignedComplaintsCount: number): number {
    const maxComplaints = 5;
    return Math.min((assignedComplaintsCount / maxComplaints) * 100, 100);
  }

  getWorkloadColor(workload: number): string {
    if (workload < 50) return 'primary';
    if (workload < 80) return 'accent';
    return 'warn';
  }

  onComplaintAssignment(teamMemberId: string, complaintId: string): void {
    const currentSelections = this.selectedAssignments();
    if (complaintId) {
      currentSelections.set(teamMemberId, complaintId);
    } else {
      currentSelections.delete(teamMemberId);
    }
    this.selectedAssignments.set(new Map(currentSelections));
  }

  getSelectedComplaint(teamMemberId: string): string | null {
    return this.selectedAssignments().get(teamMemberId) || null;
  }

  hasPendingChanges(teamMemberId: string): boolean {
    const selectedComplaintId = this.getSelectedComplaint(teamMemberId);
    return selectedComplaintId !== null && selectedComplaintId !== '';
  }

  async assignComplaint(teamMemberId: string): Promise<void> {
    const selectedComplaintId = this.getSelectedComplaint(teamMemberId);
    const teamMember = this.teamMembersWithAssignments().find(m => m.id === teamMemberId);
    const complaint = this.complaints().find(c => c.id === selectedComplaintId);

    if (!teamMember || !complaint) {
      this.showMessage('Team member or complaint not found', 'error');
      return;
    }

    this.loading.set(true);

    try {
      const newAssignment: Omit<Assignment, 'id'> = {
        complaintId: selectedComplaintId!,
        responsibleId: teamMemberId,
        assignedDate: new Date().toISOString(),
        assignedBy: 'manager',
        status: 'active'
      };

      await new Promise((resolve, reject) => {
        this.http.post<Assignment>(`${this.baseUrl}/complaintAssignments`, newAssignment).subscribe({
          next: (assignment) => {
            this.assignmentsSignal.update(assignments => [...assignments, assignment]);
            this.updateComplaintAssignment(selectedComplaintId!, teamMemberId);
            this.showMessage(`Complaint assigned to ${teamMember.firstName} ${teamMember.lastName}`, 'success');
            resolve(assignment);
          },
          error: (error) => {
            reject(error);
          }
        });
      });

      const currentSelections = this.selectedAssignments();
      currentSelections.delete(teamMemberId);
      this.selectedAssignments.set(new Map(currentSelections));

    } catch (error) {
      this.showMessage('Error assigning complaint', 'error');
    } finally {
      this.loading.set(false);
    }
  }

  private updateComplaintAssignment(complaintId: string, teamMemberId: string): void {
    const complaint = this.complaints().find(c => c.id === complaintId);
    if (!complaint) return;

    const teamMember = this.teamMembers().find(m => m.id === teamMemberId);
    const assignedTo = teamMember ? `${teamMember.firstName} ${teamMember.lastName} - ${teamMember.department}` : 'Not assigned';

    // Actualizar la queja localmente
    complaint.responsibleId = teamMemberId;
    complaint.assignedTo = assignedTo;
    complaint.updateDate = new Date().toISOString();

    // Actualizar en el backend
    this.http.put<any>(`${this.baseUrl}/complaints/${complaintId}`, {
      id: complaint.id,
      category: complaint.category,
      department: complaint.department,
      city: complaint.city,
      district: complaint.district,
      location: complaint.location,
      referenceInfo: complaint.referenceInfo,
      description: complaint.description,
      status: complaint.status,
      priority: complaint.priority,
      evidence: complaint.evidence,
      assignedTo: complaint.assignedTo,
      updateMessage: complaint.updateMessage,
      updateDate: complaint.updateDate,
      timeline: complaint.timeline,
      responsibleId: complaint.responsibleId
    }).subscribe({
      next: () => {
        this.complaintsSignal.update(complaints =>
          complaints.map(c => c.id === complaintId ? complaint : c)
        );
      },
      error: (error) => {
        console.error('Error updating complaint:', error);
      }
    });
  }

  getTeamMemberName(teamMemberId: string): string {
    const member = this.teamMembers().find(m => m.id === teamMemberId);
    return member ? `${member.firstName} ${member.lastName}` : 'Unknown';
  }

  getTeamMemberDepartment(teamMemberId: string): string {
    const member = this.teamMembers().find(m => m.id === teamMemberId);
    return member ? member.department : 'Unknown';
  }

  unassignComplaint(assignmentId: string): void {
    if (!assignmentId) {
      return;
    }

    this.loading.set(true);

    this.http.put<Assignment>(`${this.baseUrl}/complaintAssignments/${assignmentId}`, {
      status: 'completed'
    }).subscribe({
      next: () => {
        this.assignmentsSignal.update(assignments =>
          assignments.map(a => a.id === assignmentId ? { ...a, status: 'completed' } : a)
        );
        this.showMessage('Complaint unassigned successfully', 'success');
        this.loading.set(false);
      },
      error: (error) => {
        this.showMessage('Error unassigning complaint', 'error');
        this.loading.set(false);
      }
    });
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    });
  }

  reloadData(): void {
    this.loadAllData();
  }

  clearFilters(): void {
    this.filterForm.patchValue({
      department: '',
      status: '',
      priority: ''
    });
  }

  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      'available': 'check_circle',
      'busy': 'pending',
      'offline': 'cancel'
    };
    return statusIcons[status] || 'help';
  }

  getStatusTranslation(status: string): string {
    const statusMap: { [key: string]: string } = {
      'available': 'TEAM_MANAGEMENT.TABLE.STATUS.ONLINE',
      'offline': 'TEAM_MANAGEMENT.TABLE.STATUS.OFFLINE',
      'busy': 'TEAM_MANAGEMENT.TABLE.STATUS.BUSY'
    };
    return statusMap[status] || status;
  }

  getPriorityIcon(priority: string): string {
    const priorityIcons: { [key: string]: string } = {
      'Standard': 'arrow_downward',
      'Urgent': 'arrow_upward',
      'Critical': 'warning'
    };
    return priorityIcons[priority] || 'help';
  }

  getAssignmentIdForComplaint(member: TeamMemberWithComplaints, complaintId: string): string {
    const assignment = member.currentAssignments.find(a => a.complaintId === complaintId);
    return assignment?.id || '';
  }

  navigateToCreateResponsible(): void {
    this.router.navigate(['/responsible-create']);
  }

  navigateBackToAssignment(): void {
    this.router.navigate(['/team-management']);
  }
}
