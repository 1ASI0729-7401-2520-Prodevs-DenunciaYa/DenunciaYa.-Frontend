import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-plan-form',
  imports: [
    MatButton,
    TranslatePipe
  ],
  templateUrl: './plan-form.html',
  styleUrl: './plan-form.css'
})
/** @class PlanForm
 * @constructor
 * @param {Router} router - Angular Router for navigation.
 * @method selectPlan - Selects a subscription plan.
 * @method navigateToLogin - Navigates to the login page.
 * @method continueToRegister - Continues to the registration/payment page with the selected plan.
 * @author Omar Harold Rivera Ticllacuri
 */
export class PlanForm {
  selectedPlan: string | null = null;

  constructor(private router: Router) {}

  selectPlan(plan: string) {
    this.selectedPlan = plan;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  continueToRegister() {
    if (this.selectedPlan) {
      const pendingUser = localStorage.getItem('pendingUser');
      if (pendingUser) {
        const user = JSON.parse(pendingUser);
        user.plan = this.selectedPlan;
        localStorage.setItem('pendingUser', JSON.stringify(user));
      }

      this.router.navigate(['authentication/payment'], {
        queryParams: { plan: this.selectedPlan },
      });
    }
  }

  }



