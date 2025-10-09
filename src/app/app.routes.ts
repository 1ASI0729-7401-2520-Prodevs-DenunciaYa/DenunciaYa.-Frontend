
import {Routes,RouterModule} from "@angular/router";
import {CommunityPage} from './community/presentation/community-page/community-page';
import {MapTrackingComponent} from './map/presentation/view/map-tracking/map-tracking';
import {
  AuthorityMetricsAndGraphs
} from './history-and-follow-up-of-complaints/presentation/view/authority-metrics-and-graphs/authority-metrics-and-graphs';
import {
  ResponsibleCreateComponent
} from './authorities-panel/presentation/responsible-create.component.ts/responsible-create.component';
import {ProfileResponsibleComponent} from './authorities-panel/presentation/profile-responsible/profile-responsible';
import {
  AuthorityHomeComponent
} from './history-and-follow-up-of-complaints/presentation/view/authority-home/authority-home';

import {ComplaintForm} from './complaint-creation/presentation/views/complaint-form/complaint-form';
import {ComplaintList} from './complaint-creation/presentation/views/complaint-list/complaint-list';

import {TeamManagementComponent} from './authorities-panel/presentation/team-management/team-management';
export const routes: Routes = [
  { path: 'pages/community', component: CommunityPage },
  { path: 'pages/map', component: MapTrackingComponent },
  { path: 'pages/metrics', component: AuthorityMetricsAndGraphs },
  { path: 'pages/profile', component: ProfileResponsibleComponent },
  { path: 'pages/responsibleCreate', component: ResponsibleCreateComponent },
  {path: 'authority/home', component: AuthorityHomeComponent},

  {path: 'pages/complainForm', component: ComplaintForm},
  {path: 'pages/complainList', component: ComplaintList},

  {path: 'pages/teamManagment', component: TeamManagementComponent},



  { path: '', redirectTo: 'pages/community', pathMatch: 'full' },
];
