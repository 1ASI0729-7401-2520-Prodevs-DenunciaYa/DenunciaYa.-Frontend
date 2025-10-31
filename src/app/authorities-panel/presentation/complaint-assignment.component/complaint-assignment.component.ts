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

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  assignedComplaints: string[];
  specialization: string[];
  workload: number;
}

interface Case {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
}

interface Assignment {
  id: string;
  complaintId: string;
  responsibleId: string;
  assignedDate: string;
  assignedBy: string;
  status: 'active' | 'completed' | 'reassigned';
}

interface TeamMemberWithCases extends TeamMember {
  currentAssignments: Assignment[];
  assignedCases: Case[];
  availableCases: Case[];
  workload: number;
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
/**
 * @class ComplaintAssigmentComponent
 * @summary Component for managing complaint assignments to team members.
 * @method ngOnInit - Initializes the component and loads data.
 * @method loadAllData - Loads team members, cases, and assignments from the API.
 * @method getAvailableCasesForMember - Retrieves available cases for a specific team member based on their specialization.
 * @method calculateWorkload - Calculates the workload percentage for a team member.
 * @method onCaseAssignment - Handles case selection for assignment to a team member.
 * @method assignCase - Assigns a selected case to a team member and updates the backend.
 * @method unassignCase - Unassigns a case from a team member and updates the backend.
 * @method showMessage - Displays a snack bar message for user feedback.
 */
export class ComplaintAssigmentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private http = inject(HttpClient);
  private router = inject(Router);

  private teamMembersSignal = signal<TeamMember[]>([]);
  private casesSignal = signal<Case[]>([]);
  private assignmentsSignal = signal<Assignment[]>([]);
  loading = signal<boolean>(false);
  selectedAssignments = signal<Map<string, string>>(new Map());

  departmentFilter = signal<string>('');
  statusFilter = signal<string>('');
  priorityFilter = signal<string>('');

  private readonly baseUrl = 'http://localhost:3000';

  readonly teamMembers = this.teamMembersSignal.asReadonly();
  readonly cases = this.casesSignal.asReadonly();
  readonly assignments = this.assignmentsSignal.asReadonly();

  readonly activeAssignments = computed(() =>
    this.assignments().filter(a => a.status === 'active')
  );

  readonly teamStats = computed(() => {
    const members = this.teamMembers();
    const activeCases = this.cases().filter(c =>
      c.status === 'assigned' || c.status === 'in-progress'
    ).length;

    return {
      totalMembers: members.length,
      availableMembers: members.filter(m => m.status === 'available').length,
      busyMembers: members.filter(m => m.status === 'busy').length,
      activeCases: activeCases,
      totalCases: this.cases().length
    };
  });

  readonly departments = computed(() => {
    const departments = this.teamMembers().map(m => m.department);
    return [...new Set(departments)].sort();
  });

  readonly statuses = computed(() => {
    const statuses = this.cases().map(c => c.status);
    return [...new Set(statuses)].sort();
  });

  readonly priorities = computed(() => {
    const priorities = this.cases().map(c => c.priority);
    return [...new Set(priorities)].sort();
  });

  teamMembersWithAssignments = computed(() => {
    const members = this.teamMembers();
    const assignments = this.activeAssignments();
    const cases = this.cases();

    let filteredMembers = members;

    if (this.departmentFilter()) {
      filteredMembers = filteredMembers.filter(m =>
        m.department === this.departmentFilter()
      );
    }

    return filteredMembers.map(member => {
      const memberAssignments = assignments.filter(a => a.responsibleId === member.id);
      const assignedCases = memberAssignments.map(assignment =>
        cases.find(c => c.id === assignment.complaintId)
      ).filter(Boolean) as Case[];

      const availableCases = this.getAvailableCasesForMember(member);

      const teamMemberWithCases: TeamMemberWithCases = {
        ...member,
        currentAssignments: memberAssignments,
        assignedCases: assignedCases,
        availableCases: availableCases,
        workload: this.calculateWorkload(member, assignedCases.length)
      };

      return teamMemberWithCases;
    });
  });

  assignmentForm: FormGroup;
  filterForm: FormGroup;
  displayedColumns: string[] = ['teamMember', 'status', 'workload', 'assignedCases', 'availableCases', 'actions'];

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
      this.loadCases(),
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
      return ['teamMember', 'workload', 'availableCases', 'actions'];
    } else if (screenWidth < 1024) {
      return ['teamMember', 'status', 'workload', 'availableCases', 'actions'];
    } else {
      return ['teamMember', 'status', 'workload', 'assignedCases', 'availableCases', 'actions'];
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

  private loadCases(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<any[]>(`${this.baseUrl}/complaints`).subscribe({
        next: (complaints) => {
          const cases: Case[] = complaints.map(complaint => ({
            id: complaint.id,
            title: `Case #${complaint.id}`,
            description: complaint.description,
            category: complaint.category,
            priority: this.mapPriority(complaint.priority),
            status: this.mapStatus(complaint.status),
            assignedTo: complaint.responsibleId,
            createdAt: complaint.updateDate || new Date().toISOString(),
            updatedAt: complaint.updateDate || new Date().toISOString(),
            tags: [complaint.category, complaint.priority]
          }));
          this.casesSignal.set(cases);
          resolve();
        },
        error: (error) => {
          this.showMessage('Error loading cases', 'error');
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

  private mapPriority(priority: string): 'low' | 'medium' | 'high' | 'critical' {
    const priorityMap: { [key: string]: 'low' | 'medium' | 'high' | 'critical' } = {
      'Standard': 'medium',
      'Urgent': 'high',
      'Critical': 'critical'
    };
    return priorityMap[priority] || 'medium';
  }

  private mapStatus(status: string): 'new' | 'assigned' | 'in-progress' | 'resolved' | 'closed' {
    const statusMap: { [key: string]: 'new' | 'assigned' | 'in-progress' | 'resolved' | 'closed' } = {
      'Pending': 'new',
      'Under review': 'in-progress',
      'Awaiting response': 'assigned',
      'Decision pending': 'in-progress',
      'Completed': 'resolved',
      'Rejected': 'closed'
    };
    return statusMap[status] || 'new';
  }

  getAvailableCasesForMember(member: TeamMember): Case[] {
    const unassignedCases = this.cases().filter(caseItem =>
      !caseItem.assignedTo &&
      caseItem.status === 'new' &&
      member.specialization.some(spec =>
        caseItem.category.toLowerCase().includes(spec.toLowerCase()) ||
        spec.toLowerCase().includes(caseItem.category.toLowerCase())
      )
    );

    if (this.priorityFilter()) {
      return unassignedCases.filter(c => c.priority === this.priorityFilter());
    }

    return unassignedCases;
  }

  calculateWorkload(member: TeamMember, assignedCasesCount: number): number {
    const maxCases = 5;
    return Math.min((assignedCasesCount / maxCases) * 100, 100);
  }

  getWorkloadColor(workload: number): string {
    if (workload < 50) return 'primary';
    if (workload < 80) return 'accent';
    return 'warn';
  }

  onCaseAssignment(teamMemberId: string, caseId: string): void {
    const currentSelections = this.selectedAssignments();
    if (caseId) {
      currentSelections.set(teamMemberId, caseId);
    } else {
      currentSelections.delete(teamMemberId);
    }
    this.selectedAssignments.set(new Map(currentSelections));
  }

  getSelectedCase(teamMemberId: string): string | null {
    return this.selectedAssignments().get(teamMemberId) || null;
  }

  hasPendingChanges(teamMemberId: string): boolean {
    const selectedCaseId = this.getSelectedCase(teamMemberId);
    return selectedCaseId !== null && selectedCaseId !== '';
  }

  async assignCase(teamMemberId: string): Promise<void> {
    const selectedCaseId = this.getSelectedCase(teamMemberId);
    const teamMember = this.teamMembersWithAssignments().find(m => m.id === teamMemberId);
    const caseItem = this.cases().find(c => c.id === selectedCaseId);

    if (!teamMember || !caseItem) {
      this.showMessage('Team member or case not found', 'error');
      return;
    }

    this.loading.set(true);

    try {
      const newAssignment: Omit<Assignment, 'id'> = {
        complaintId: selectedCaseId!,
        responsibleId: teamMemberId,
        assignedDate: new Date().toISOString(),
        assignedBy: 'manager',
        status: 'active'
      };

      await new Promise((resolve, reject) => {
        this.http.post<Assignment>(`${this.baseUrl}/complaintAssignments`, newAssignment).subscribe({
          next: (assignment) => {
            this.assignmentsSignal.update(assignments => [...assignments, assignment]);
            this.updateCaseAssignment(selectedCaseId!, teamMemberId);
            this.showMessage(`Case assigned to ${teamMember.firstName} ${teamMember.lastName}`, 'success');
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
      this.showMessage('Error assigning case', 'error');
    } finally {
      this.loading.set(false);
    }
  }

  private updateCaseAssignment(caseId: string, teamMemberId: string): void {
    const caseItem = this.cases().find(c => c.id === caseId);
    if (!caseItem) return;

    const updatedCase = {
      ...caseItem,
      assignedTo: teamMemberId,
      status: 'assigned' as const,
      updatedAt: new Date().toISOString()
    };

    this.http.put<any>(`${this.baseUrl}/complaints/${caseId}`, {
      ...updatedCase,
      responsibleId: teamMemberId,
      assignedTo: `${this.getTeamMemberName(teamMemberId)} - ${this.getTeamMemberDepartment(teamMemberId)}`
    }).subscribe({
      next: () => {
        this.casesSignal.update(cases =>
          cases.map(c => c.id === caseId ? updatedCase : c)
        );
      },
      error: (error) => {
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

  unassignCase(assignmentId: string): void {
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
        this.showMessage('Case unassigned successfully', 'success');
        this.loading.set(false);
      },
      error: (error) => {
        this.showMessage('Error unassigning case', 'error');
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
      'online': 'TEAM_MANAGEMENT.TABLE.STATUS.ONLINE',
      'offline': 'TEAM_MANAGEMENT.TABLE.STATUS.OFFLINE',
      'busy': 'TEAM_MANAGEMENT.TABLE.STATUS.BUSY',
      'away': 'TEAM_MANAGEMENT.TABLE.STATUS.AWAY'
    };
    return statusMap[status] || status;
  }
  getPriorityIcon(priority: string): string {
    const priorityIcons: { [key: string]: string } = {
      'low': 'arrow_downward',
      'medium': 'remove',
      'high': 'arrow_upward',
      'critical': 'warning'
    };
    return priorityIcons[priority] || 'help';
  }
  getAssignmentIdForCase(member: TeamMemberWithCases, caseId: string): string {
    const assignment = member.currentAssignments.find(a => a.complaintId === caseId);
    return assignment?.id || '';
  }

  navigateToCreateResponsible(): void {
    this.router.navigate(['/responsible-create']);
  }

  navigateBackToAssignment(): void {
    this.router.navigate(['/team-management']);
  }
}
