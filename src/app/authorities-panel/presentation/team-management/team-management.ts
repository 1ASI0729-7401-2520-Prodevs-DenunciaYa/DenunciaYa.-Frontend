import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { ResponsibleCreateStore } from '../../application/responsibleCreate.store';
import { Responsible } from '../../domain/model/responsibleCreate.entity';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, TranslatePipe, FormsModule],
  templateUrl: './team-management.html',
  styleUrls: ['./team-management.css']
})
export class TeamManagementComponent implements OnInit {
  private store = inject(ResponsibleCreateStore);
  private router = inject(Router);

  responsibles: Array<{
    id: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    email: string;
    phone: string;
    role: string;
    caseCount: number;
    accessLevel: string;
    createdAt: Date;
    assignedComplaints: string[];
    status: 'active' | 'inactive';
  }> = [];

  filteredResponsibles: typeof this.responsibles = [];
  loading = signal<boolean>(false);
  searchKeyword = '';

  ngOnInit(): void {
    this.loadResponsibles();
    this.store.responsibles$.subscribe(responsibles => {
      this.updateResponsiblesList(responsibles);
    });
  }

  loadResponsibles(): void {
    this.store.loadResponsibles();
  }

  updateResponsiblesList(responsibles: Responsible[]): void {
    this.responsibles = responsibles.map(r => ({
      id: r.id,
      firstName: r.firstName,
      lastName: r.lastName,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      role: r.role,
      caseCount: r.getComplaintCount(),
      accessLevel: r.accessLevel,
      assignedComplaints: r.assignedComplaints,
      status: r.status,
      createdAt: r.createdAt
    }));
    this.filteredResponsibles = [...this.responsibles];
  }

  addResponsible(): void {
    const firstName = prompt('First name');
    const lastName = prompt('Last name');
    const email = prompt('Email');
    const phone = prompt('Phone');
    const role = prompt('Role');
    const description = prompt('Description') || '';
    const accessLevel = prompt('Access Level (SUPERVISOR|ADMINISTRADOR|TECNICO)') || 'TECNICO';
    const position = prompt('Position') || role || '';
    const department = prompt('Department') || 'Default Department';

    if (!firstName || !lastName || !email || !phone || !role) {
      alert('Missing required fields');
      return;
    }

    this.store.addResponsible({
      firstName,
      lastName,
      email,
      phone,
      role,
      description,
      accessLevel: accessLevel.toUpperCase(),
      status: 'active',
      position,
      department,
      assignedComplaints: []
    } as unknown as Responsible).subscribe({
      next: () => {
        alert('Responsible added successfully');
      },
      error: (error) => {
        console.error('Error adding responsible:', error);
        alert('Error adding responsible');
      }
    });
  }

  searchResponsibles(): void {
    if (!this.searchKeyword.trim()) {
      this.filteredResponsibles = [...this.responsibles];
      return;
    }

    this.store.searchResponsibles(this.searchKeyword).subscribe({
      next: (responsibles) => {
        this.filteredResponsibles = responsibles.map(r => ({
          id: r.id,
          firstName: r.firstName,
          lastName: r.lastName,
          fullName: r.fullName,
          email: r.email,
          phone: r.phone,
          role: r.role,
          caseCount: r.getComplaintCount(),
          accessLevel: r.accessLevel,
          assignedComplaints: r.assignedComplaints,
          status: r.status,
          createdAt: r.createdAt
        }));
      },
      error: (error) => {
        console.error('Error searching responsibles:', error);
        this.filteredResponsibles = [];
      }
    });
  }

  editResponsible(responsible: any): void {
    const newFirstName = prompt('New first name', responsible.firstName);
    const newLastName = prompt('New last name', responsible.lastName);
    const newEmail = prompt('New email', responsible.email);
    const newPhone = prompt('New phone', responsible.phone);
    const newRole = prompt('New role', responsible.role);
    const newAccessLevel = prompt('New access level', responsible.accessLevel);
    const newStatus = prompt('New status (active/inactive)', responsible.status);

    if (newFirstName && newLastName && newEmail && newPhone && newRole) {
      this.store.updateResponsible(responsible.id, {
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        phone: newPhone,
        role: newRole,
        accessLevel: newAccessLevel || responsible.accessLevel,
        status: (newStatus === 'active' || newStatus === 'inactive') ? newStatus : responsible.status
      } as Partial<Responsible>).subscribe({
        next: () => {
          alert('Responsible updated successfully');
        },
        error: (error) => {
          console.error('Error updating responsible:', error);
          alert('Error updating responsible');
        }
      });
    }
  }

  deleteResponsible(responsible: any): void {
    if (confirm(`Are you sure you want to delete ${responsible.fullName}?`)) {
      this.store.deleteResponsible(responsible.id).subscribe({
        next: () => {
          alert('Responsible deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting responsible:', error);
          alert('Error deleting responsible');
        }
      });
    }
  }

  assignComplaint(responsible: any): void {
    // Redirigir a la lista de denuncias con este responsable seleccionado
    this.router.navigate(['/complaint-list'], {
      queryParams: { assignTo: responsible.id }
    });
  }

  viewResponsibleProfile(responsible: any): void {
    this.router.navigate(['/responsible-profile', responsible.id]);
  }

  // Obtener el formato completo para usar en dropdowns
  getResponsibleFullFormat(responsible: any): string {
    return `${responsible.fullName} - ${responsible.position || responsible.role} [${responsible.id}]`;
  }
}
