import { Routes } from '@angular/router';
import {LayoutComponent} from './shared/presentation/components/layout/layout';
import {AuthLayoutComponent} from './shared/presentation/components/auth-layout/auth-layout';

import { CommunityPage } from './community/presentation/community-page/community-page';
import { MapTrackingComponent } from './map/presentation/view/map-tracking/map-tracking';
import { AuthorityMetricsAndGraphs } from './history-and-follow-up-of-complaints/presentation/view/authority-metrics-and-graphs/authority-metrics-and-graphs';
import { ResponsibleCreateComponent } from './authorities-panel/presentation/responsible-create.component.ts/responsible-create.component';
import { ProfileResponsibleComponent } from './authorities-panel/presentation/profile-responsible/profile-responsible';
import { AuthorityHomeComponent } from './history-and-follow-up-of-complaints/presentation/view/authority-home/authority-home';
import { ComplaintForm } from './complaint-creation/presentation/views/complaint-form/complaint-form';
import { ComplaintList } from './complaint-creation/presentation/views/complaint-list/complaint-list';
import { ComplaintDetailCitizen } from './history-and-follow-up-of-complaints/presentation/view/complaint-detail-citizen/complaint-detail-citizen';
import { EditComplaintComponent } from './authorities-panel/presentation/edit-complaint/edit-complaint';
import { ComplaintDetailAuthority } from './history-and-follow-up-of-complaints/presentation/view/complaint-detail-authority/complaint-detail-authority';
import {TeamManagementComponent} from './authorities-panel/presentation/team-management/team-management';
import {
  ComplaintAssigmentComponent
} from './authorities-panel/presentation/complaint-assignment.component/complaint-assignment.component';
import {SupportHelpComponent} from './history-and-follow-up-of-complaints/presentation/view/support/support';

import {
  ComplaintEditCitizen
} from './complaint-creation/presentation/views/complaint-edit-citizen/complaint-edit-citizen';
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
export const routes: Routes =[



      { path: 'pages/login-owner', component: LoginOwnerComponent },
      { path: 'pages/login-worker', component: LoginWorkerComponent },
      { path: 'pages/register-worker', component: RegisterWorkerComponent },
      { path: 'pages/register-owner', component: RegisterOwnerComponent },
      { path: 'pages/recover-password-worker', component: RecoverPasswordWorkerComponent },
      { path: 'pages/recover-password-owner', component: RecoverPasswordOwnerComponent },
      { path: 'pages/restore-owner', component: RestoreOwnerComponent },
      { path: 'pages/restore-worker', component: RestoreWorkerComponent },
      { path: 'pages/validation', component: ValidationComponent },



      { path: 'community', component: CommunityPage },
      { path: 'map', component: MapTrackingComponent },
      { path: 'metrics', component: AuthorityMetricsAndGraphs },
      { path: 'responsible-create', component: ResponsibleCreateComponent },
      { path: 'home', component: AuthorityHomeComponent },
      { path: 'complaint-form', component: ComplaintForm },
      { path: 'complaint-list', component: ComplaintList },
      { path: 'team-managment', component: ComplaintAssigmentComponent },
      { path: 'complaints', component: ComplaintList },
      { path: 'complaint-detail/:id', component: ComplaintDetailAuthority },
      { path: 'complaint-edit/:id', component: EditComplaintComponent },
      { path: 'support', component: SupportHelpComponent },
      { path: 'complaint-creation/complaints/new', component: ComplaintForm },
      { path: 'responsible-profile/:id', component: ProfileResponsibleComponent },
      { path: 'complaints/edit/:id', component: ComplaintEditCitizen },

      { path: '', redirectTo: 'pages/login-owner', pathMatch: 'full' },
      {
        path: 'complaint-detail/:id',
        component: ComplaintDetailAuthority,
        data: { roles: ['authority', 'responsibles'] }
      },
      {
        path: 'complaint-detail-citizen/:id',
        component: ComplaintDetailCitizen,
        data: { roles: ['citizen'] }
      },



  { path: '**', redirectTo: 'home' }
];
