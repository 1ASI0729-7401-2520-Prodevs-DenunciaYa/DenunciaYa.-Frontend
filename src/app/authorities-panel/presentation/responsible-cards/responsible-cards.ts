import {Component, OnInit} from '@angular/core';
import {Responsible} from '../../domain/model/responsibleCreate.entity';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ResponsibleCreateStore} from '../../application/responsibleCreate.store';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-responsible-cards',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './responsible-cards.html',
  styleUrls: ['./responsible-cards.css']
})
/** @class Responsible
 * @summary Component for displaying and creating responsible cards.
 * @description This component displays a list of responsible cards and provides a form to create new responsibles.
 * @method ngOnInit Initializes the component and loads the list of responsibles.
 * @method loadResponsibles Loads the list of responsibles from the store.
 * @method onSubmit Handles the form submission to create a new responsible.
 * @method isValidResponsible Validates the new responsible data before submission.
 * @method resetForm Resets the form fields after successful creation.
 * @author Omar Harold Rivera Ticllacuri
 */
export class ResponsibleCardsComponent implements OnInit {
  responsibles: Responsible[] = [];
  loading = false;

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
          this.resetForm();
          this.loading = false;
        },
        error: (error) => {
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
