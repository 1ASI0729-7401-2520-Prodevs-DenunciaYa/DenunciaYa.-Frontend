import { Routes } from '@angular/router';
import { authenticationRoutes } from './authentication-and-account-management/presentation/authentication.routes';
import { complaintsRoutes } from './history-and-follow-up-of-complaints/presentation/complaints.routes';
import { AuthorityHomeComponent } from './history-and-follow-up-of-complaints/presentation/view/authority-home/authority-home';
import { AuthorityMetricsAndGraphs } from './history-and-follow-up-of-complaints/presentation/view/authority-metrics-and-graphs/authority-metrics-and-graphs';

const CommunityPage = () =>
  import('./community/presentation/community-page/community-page')
    .then(m => m.CommunityPage);

export const routes: Routes = [
  ...authenticationRoutes,

  ...complaintsRoutes,

  { path: 'authority/home', component: AuthorityHomeComponent },
  { path: 'authority/metrics-and-graphs', component: AuthorityMetricsAndGraphs },
  { path: 'authority', redirectTo: '/authority/home', pathMatch: 'full' },

  {
    path: '',
    children: [
      { path: 'communities/home', loadComponent: CommunityPage },
      { path: '', redirectTo: '/communities/home', pathMatch: 'full' }
    ]
  },

  { path: 'authority/complaints/:id', redirectTo: '/authority/complaints/:id', pathMatch: 'full' },
  { path: 'citizen/complaints/:id', redirectTo: '/citizen/complaints/:id', pathMatch: 'full' },
  { path: 'citizen', redirectTo: '/citizen/complaints', pathMatch: 'full' },

  { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/authentication/login' }
];
