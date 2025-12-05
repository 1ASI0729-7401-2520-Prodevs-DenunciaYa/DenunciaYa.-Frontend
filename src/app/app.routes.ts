import { Routes } from '@angular/router';
import {LayoutComponent} from './shared/presentation/components/layout/layout';
import {AuthLayoutComponent} from './shared/presentation/components/auth-layout/auth-layout';

import { CommunityPage } from './community/presentation/community-page/community-page';
import { AuthorityMetricsAndGraphs } from './history-and-follow-up-of-complaints/presentation/view/authority-metrics-and-graphs/authority-metrics-and-graphs';
import { ComplaintDetailCitizen } from './history-and-follow-up-of-complaints/presentation/view/complaint-detail-citizen/complaint-detail-citizen';
import { EditComplaintComponent } from './authorities-panel/presentation/edit-complaint/edit-complaint';
import { ComplaintDetailAuthority } from './history-and-follow-up-of-complaints/presentation/view/complaint-detail-authority/complaint-detail-authority';



import { LoginOwnerComponent } from './public/pages/login/login-owner/login-owner.component';
import { LoginWorkerComponent } from './public/pages/login/login-worker/login-worker.component';
import {RegisterWorkerComponent} from './public/pages/login/register-user/register-worker/register-worker.component';
import { RegisterOwnerComponent } from './public/pages/login/register-user/register-owner/register-owner.component';
import {
  RecoverPasswordWorkerComponent
} from './public/pages/login/recover-password-worker/recover-password-worker.component';
import {
  RecoverPasswordOwnerComponent
} from './public/pages/login/recover-password-owner/recover-password-owner.component';
import {RestoreOwnerComponent} from './public/pages/login/restore-owner/restore-owner.component';
import {RestoreWorkerComponent} from './public/pages/login/restore-worker/restore-worker.component';
import {ValidationComponent} from './public/pages/login/validation/validation.component';
import { AuthGuard } from './guards/auth.guard';
import {
  AuthorityHomeComponent
} from './history-and-follow-up-of-complaints/presentation/view/authority-home/authority-home';
import {MapTrackingComponent} from './map/presentation/view/map-tracking/map-tracking';
import {ResponsibleCardsComponent} from './authorities-panel/presentation/responsible-cards/responsible-cards';
import {
  ResponsibleCreateComponent
} from './authorities-panel/presentation/responsible-create.component.ts/responsible-create.component';
import {ComplaintForm} from './complaint-creation/presentation/views/complaint-form/complaint-form';
import { ComplaintList } from './complaint-creation/presentation/views/complaint-list/complaint-list';
import {SupportHelpComponent} from './history-and-follow-up-of-complaints/presentation/view/support/support';
import {ProfileResponsibleComponent} from './authorities-panel/presentation/profile-responsible/profile-responsible';
import {
  ComplaintEditCitizen
} from './complaint-creation/presentation/views/complaint-edit-citizen/complaint-edit-citizen';

export const routes: Routes =[
  // Rutas públicas dentro de un layout de autenticación
  {
    path: 'pages',
    component: AuthLayoutComponent,
    children: [
      { path: 'login-owner', component: LoginOwnerComponent },
      { path: 'login-worker', component: LoginWorkerComponent },
      { path: 'register-worker', component: RegisterWorkerComponent },
      { path: 'register-owner', component: RegisterOwnerComponent },
      { path: 'recover-password-worker', component: RecoverPasswordWorkerComponent },
      { path: 'recover-password-owner', component: RecoverPasswordOwnerComponent },
      { path: 'restore-owner', component: RestoreOwnerComponent },
      { path: 'restore-worker', component: RestoreWorkerComponent },
      { path: 'validation', component: ValidationComponent },
      { path: '', redirectTo: 'login-owner', pathMatch: 'full' }
    ]
  },

  // Rutas de la aplicación dentro del layout principal que contiene el sidenav
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: AuthorityHomeComponent },
      { path: 'community', component: CommunityPage },
      { path: 'map', component: MapTrackingComponent },
      { path: 'metrics', component: AuthorityMetricsAndGraphs },
      { path: 'responsible-create', component: ResponsibleCreateComponent },
      { path: 'complaint-form', component: ComplaintForm },
      { path: 'complaint-list', component: ComplaintList },
      { path: 'team-managment', component: ResponsibleCardsComponent },
      { path: 'complaints', component: ComplaintList },
      { path: 'complaint-detail/:id', component: ComplaintDetailAuthority },
      { path: 'complaint-edit/:id', component: EditComplaintComponent },
      { path: 'support', component: SupportHelpComponent },
      { path: 'complaint-creation/complaints/new', component: ComplaintForm },
      { path: 'responsible-profile/:id', component: ProfileResponsibleComponent },
      { path: 'complaints/edit/:id', component: ComplaintEditCitizen },
      { path: 'complaint-detail-citizen/:id', component: ComplaintDetailCitizen, data: { roles: ['citizen'] } },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // Catch-all: redirige a la página principal
  { path: '**', redirectTo: '' }
];
