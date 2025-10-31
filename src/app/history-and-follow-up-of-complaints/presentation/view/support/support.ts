import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * @class SupportHelpComponent
 * @summary Component for support and help form
 *
 * @classdesc
 * Component that handles the technical support request form,
 * allowing users to submit inquiries, report problems,
 * or request assistance.
 *
 * @method submitSupportRequest - Submits the support request

 */
@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TranslatePipe
  ],
  templateUrl: './support.html',
  styleUrl: './support.css'
})
export class SupportHelpComponent {
  /**
   * @property {FormGroup} supportForm - Reactive form for support request
   */
  supportForm: FormGroup;

  /**
   * @constructor
   * @param {FormBuilder} fb - Service for creating reactive forms
   */
  constructor(private fb: FormBuilder) {
    this.supportForm = this.fb.group({
      subject: ['', Validators.required],
      complaintNumber: [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  /**
   * @method submitSupportRequest
   * @summary Submits the support request
   * @description
   * Validates and processes the support form. If valid, displays
   * a confirmation message and resets the form. If invalid,
   * marks all fields as touched to show validation errors.
   *
   * @returns {void}
   */
  submitSupportRequest(): void {
    if (this.supportForm.valid) {
      const formData = this.supportForm.value;

      alert('Your support request has been submitted. We will contact you soon.');

      this.supportForm.reset();
    } else {
      this.markFormGroupTouched(this.supportForm);
    }
  }

  /**
   * @method markFormGroupTouched
   * @summary Marks all form controls as touched
   * @description
   * Iterates through all form controls and marks them as touched
   * to activate validation error messages display.
   *
   * @param {FormGroup} formGroup - Form to mark as touched
   * @returns {void}
   * @private
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
