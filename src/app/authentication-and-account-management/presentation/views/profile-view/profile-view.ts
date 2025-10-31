import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import {AuthService, User} from '../../../infrastructure/auth.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslatePipe
  ],
  templateUrl: './profile-view.html',
  styleUrls: ['./profile-view.css']
})
/**
 * @class ProfileView
 * @constructor
 * @summary View for displaying and editing user profile information.
 * @param {FormBuilder} fb - FormBuilder for creating the profile form.
 * @param {AuthService} authService - Service for handling authentication and user data.
 * @method loadUserData - Loads the current user data into the form.
 * @method toggleEdit - Toggles the edit mode for the profile form.
 * @method onSaveChanges - Saves changes to the user profile if the form is valid.
 * @param {toggleRole} - Toggles the user role between citizen and authority.
 *
 */
export class ProfileView implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  userRole: 'citizen' | 'authority' | 'responsibles' = 'citizen';
  selectedPlan: 'basic' | 'premium' = 'basic';
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.profileForm.disable();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userRole = this.currentUser.role;
      this.selectedPlan = this.currentUser.plan as 'basic' | 'premium' || 'basic';

      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        phone: this.currentUser.phone || ''
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      this.loadUserData();
    }
  }

  onSaveChanges(): void {
    if (this.profileForm.valid && this.currentUser) {
      const updatedUser: User = {
        ...this.currentUser,
        ...this.profileForm.value
      };

      this.authService.updateUser(updatedUser);
      this.currentUser = updatedUser;

      this.toggleEdit();
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  toggleRole(): void {
    this.userRole = this.userRole === 'citizen' ? 'authority' : 'citizen';
  }
}
