import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TitleCasePipe,
    TranslatePipe
  ],
  templateUrl: './profile-view.html',
  styleUrls: ['./profile-view.css']
})
/** @class ProfileView
 * @constructor
 * @param {FormBuilder} fb - FormBuilder for creating the profile form.
 * @method toggleEdit - Toggles between view and edit modes.
 * @param {onSaveChanges} - Saves changes if the form is valid.
 * @param {toggleRole} - Toggles the user role between citizen and authority.
 * @author Omar Harold Rivera Ticllacuri
 */
export class ProfileView {
  profileForm: FormGroup;
  isEditing = false;

  userRole: 'citizen' | 'authority' = 'authority';
  selectedPlan: 'basic' | 'premium' = 'premium';

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.profileForm.disable();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  onSaveChanges(): void {
    if (this.profileForm.valid) {
      console.log('Saved:', this.profileForm.value);
      this.toggleEdit();
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  toggleRole() {
    this.userRole = this.userRole === 'citizen' ? 'authority' : 'citizen';
  }
}
