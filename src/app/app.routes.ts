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

export const routes: Routes = [
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginForm },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'pages/community', component: CommunityPage },
      { path: 'pages/map', component: MapTrackingComponent },
      { path: 'pages/metrics', component: AuthorityMetricsAndGraphs },
      { path: 'pages/profile', component: ProfileResponsibleComponent },
      { path: 'pages/responsibleCreate', component: ResponsibleCreateComponent },
      { path: 'authority/home', component: AuthorityHomeComponent },
      { path: 'pages/complainForm', component: ComplaintForm },
      { path: 'pages/complainList', component: ComplaintList },
      { path: 'pages/teamManagment', component: ComplaintAssigmentComponent },
      { path: 'pages/settings', component: ConfigurationView },
      { path: 'configuracion', component: ConfigurationView },
      { path: 'complaints', component: ComplaintList },
      { path: 'complaint-detail/:id', component: ComplaintDetailAuthority },
      { path: 'complaint-edit/:id', component: EditComplaintComponent },
      { path: 'complaint-creation/complaints/new', component: ComplaintForm },
      { path: 'complaints/edit/:id', component: EditComplaintComponent },
      { path: 'complaint-detail/:id/responsible', component: ProfileResponsibleComponent },

      { path: '', redirectTo: 'pages/community', pathMatch: 'full' }
    ]
  },

  // 👇 Cualquier otra ruta redirige al login
  { path: '**', redirectTo: 'authentication/login' }
];
