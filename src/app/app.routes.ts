import { Routes } from '@angular/router';
import {LayoutComponent} from './shared/presentation/components/layout/layout';
import {AuthLayoutComponent} from './shared/presentation/components/auth-layout/auth-layout';
import {LoginForm} from './authentication-and-account-management/presentation/views/login-form/login-form';
import {
  RegisterComponent
} from './authentication-and-account-management/presentation/views/register-form/register-form';
import { CommunityPage } from './community/presentation/community-page/community-page';
import { MapTrackingComponent } from './map/presentation/view/map-tracking/map-tracking';
import { AuthorityMetricsAndGraphs } from './history-and-follow-up-of-complaints/presentation/view/authority-metrics-and-graphs/authority-metrics-and-graphs';
import { ResponsibleCreateComponent } from './authorities-panel/presentation/responsible-create.component.ts/responsible-create.component';
import { ProfileResponsibleComponent } from './authorities-panel/presentation/profile-responsible/profile-responsible';
import { AuthorityHomeComponent } from './history-and-follow-up-of-complaints/presentation/view/authority-home/authority-home';
import { ConfigurationView } from './authentication-and-account-management/presentation/views/configuration-view/configuration-view';
import { ComplaintForm } from './complaint-creation/presentation/views/complaint-form/complaint-form';
import { ComplaintList } from './complaint-creation/presentation/views/complaint-list/complaint-list';
import { ComplaintDetailCitizen } from './history-and-follow-up-of-complaints/presentation/view/complaint-detail-citizen/complaint-detail-citizen';
import { EditComplaintComponent } from './authorities-panel/presentation/edit-complaint/edit-complaint';
import { ComplaintDetailAuthority } from './history-and-follow-up-of-complaints/presentation/view/complaint-detail-authority/complaint-detail-authority';
import { AuthGuard } from './core/guards/auth.guard';
import {TeamManagementComponent} from './authorities-panel/presentation/team-management/team-management';
import {
  ComplaintAssigmentComponent
} from './authorities-panel/presentation/complaint-assignment.component/complaint-assignment.component';
import {SupportHelpComponent} from './history-and-follow-up-of-complaints/presentation/view/support/support';
import {ProfileView} from './authentication-and-account-management/presentation/views/profile-view/profile-view';
import {PlanForm} from './authentication-and-account-management/presentation/views/plan-form/plan-form';
import {PaymentForm} from './authentication-and-account-management/presentation/views/payment-form/payment-form';
import {
  ForgotPasswordForm
} from './authentication-and-account-management/presentation/views/forgot-password-form/forgot-password-form';
import {
  ComplaintEditCitizen
} from './complaint-creation/presentation/views/complaint-edit-citizen/complaint-edit-citizen';
import {RoleGuard} from './core/guards/RoleGuard';
export const routes: Routes = [
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginForm },
      { path: 'register', component: RegisterComponent },
      {path: 'forgot-account', component: ForgotPasswordForm},
      {path: 'register', component: RegisterComponent },
      {path:'plan', component: PlanForm},
      {path: 'payment', component: PaymentForm},
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'community', component: CommunityPage },
      { path: 'map', component: MapTrackingComponent },
      { path: 'metrics', component: AuthorityMetricsAndGraphs },
      { path: 'profile', component: ProfileView },
      { path: 'responsible-create', component: ResponsibleCreateComponent },
      { path: 'home', component: AuthorityHomeComponent },
      { path: 'complaint-form', component: ComplaintForm },
      { path: 'complaint-list', component: ComplaintList },
      { path: 'team-managment', component: ComplaintAssigmentComponent },
      { path: 'settings', component: ConfigurationView },
      { path: 'complaints', component: ComplaintList },
      { path: 'complaint-detail/:id', component: ComplaintDetailAuthority },
      { path: 'complaint-edit/:id', component: EditComplaintComponent },
      { path: 'support', component: SupportHelpComponent },
      { path: 'complaint-creation/complaints/new', component: ComplaintForm },
      { path: 'responsible-profile/:id', component: ProfileResponsibleComponent },
      { path: 'complaints/edit/:id', component: ComplaintEditCitizen },

      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'complaint-detail/:id',
        component: ComplaintDetailAuthority,
        canActivate: [RoleGuard],
        data: { roles: ['authority', 'responsibles'] }
      },
      {
        path: 'complaint-detail-citizen/:id',
        component: ComplaintDetailCitizen,
        canActivate: [RoleGuard],
        data: { roles: ['citizen'] }
      },
    ]
  },

  { path: '**', redirectTo: 'authentication/login' }
];
