import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {ConfirmDialogComponent} from '../../component/confirm-dialog.component';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcher} from '../../../../shared/presentation/components/language-switcher/language-switcher';

/** @class ConfigurationView
 * @constructor
 * @param {FormBuilder} fb - FormBuilder for creating the configuration form.
 * @param {MatDialog} dialog - MatDialog for displaying confirmation dialogs.
 * @param {MatSnackBar} snackBar - MatSnackBar for displaying notifications.
 * @method onSaveChanges - Saves changes if the form is valid after confirmation.
 * @param {navigateToPlans} - Navigates to the plan selection page after confirmation.
 * @param {toggleRole} - Toggles the user role between citizen and authority.
 * @author Omar Harold Rivera Ticllacuri
 */
@Component({
  selector: 'app-configuration-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatOptionModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslatePipe,
    LanguageSwitcher
  ],
  templateUrl: './configuration-view.html',
  styleUrls: ['./configuration-view.css']
})
export class ConfigurationView implements OnInit {
  configForm!: FormGroup;
  userRole: 'citizen' | 'authority' = 'authority';
  selectedPlan: 'basic' | 'premium' = 'basic';

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.configForm = this.fb.group({
      emailNotifications: [true],
      smsNotifications: [false],
      language: ['en']
    });
  }

  onSaveChanges() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Changes',
        message: 'Are you sure you want to save these settings?'
      },
      width: '350px'
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.snackBar.open('Changes saved successfully!', 'Close', { duration: 2500 });
        setTimeout(() => {
          this.configForm.markAsPristine();
        }, 500);
      }
    });
  }

  navigateToPlans() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Change Plan',
        message: 'Do you want to change your plan now?'
      },
      width: '350px'
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.selectedPlan = this.selectedPlan === 'basic' ? 'premium' : 'basic';
        this.snackBar.open(`Plan changed to ${this.selectedPlan}`, 'Close', { duration: 2500 });
      }
    });
  }

  toggleRole() {
    this.userRole = this.userRole === 'citizen' ? 'authority' : 'citizen';
  }
}
