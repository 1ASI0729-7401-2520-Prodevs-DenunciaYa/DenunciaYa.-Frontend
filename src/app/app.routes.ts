import { Routes } from '@angular/router';

const CommunityPage = () =>
  import('./community/presentation/community-page/community-page')
    .then(m => m.CommunityPage);

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'communities/home', loadComponent: CommunityPage },
      { path: '', redirectTo: '/communities/home', pathMatch: 'full' }
    ]
  }
];
