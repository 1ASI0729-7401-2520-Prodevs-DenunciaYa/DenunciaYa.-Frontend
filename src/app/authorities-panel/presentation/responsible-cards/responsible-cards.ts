import {Component, OnInit} from '@angular/core';
import {Responsible} from '../../domain/model/responsibleCreate.entity';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ResponsibleCreateStore} from '../../application/responsibleCreate.store';

@Component({
  selector: 'app-responsible-cards',
  imports: [CommonModule, FormsModule],
  templateUrl: './responsible-cards.html',
  styleUrls: ['./responsible-cards.css']
})
export class ResponsibleCardsComponent implements OnInit {
  responsibles: Responsible[] = [];
  loading = false;

  // Objeto para el nuevo responsable
  newResponsible: Partial<Responsible> = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    description: '',
    accessLevel: 'TECNICO',
    position: '',
    department: '',
    status: 'active'
  };

  constructor(private responsibleStore: ResponsibleCreateStore) {}

  ngOnInit(): void {
    this.loadResponsibles();
  }

  loadResponsibles(): void {
    this.responsibleStore.loadResponsibles();
    this.responsibleStore.responsibles$.subscribe({
      next: (responsibles) => {
        this.responsibles = responsibles;
      },
      error: (error) => {
        console.error('Error al cargar responsables:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.isValidResponsible()) {
      this.loading = true;

      this.responsibleStore.addResponsible(this.newResponsible).subscribe({
        next: (createdResponsible) => {
          console.log('Responsable creado exitosamente:', createdResponsible);
          this.resetForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al crear responsable:', error);
          alert('Error al crear el responsable. Por favor, intente nuevamente.');
          this.loading = false;
        }
      });
    }
  }

  isValidResponsible(): boolean {
    return !!(
      this.newResponsible.firstName?.trim() &&
      this.newResponsible.lastName?.trim() &&
      this.newResponsible.email?.trim() &&
      this.newResponsible.phone?.trim() &&
      this.newResponsible.role?.trim() &&
      this.newResponsible.accessLevel?.trim()
    );
  }

  resetForm(): void {
    this.newResponsible = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      description: '',
      accessLevel: 'TECNICO',
      position: '',
      department: '',
      status: 'active'
    };
  }
}
