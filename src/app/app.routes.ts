import { Routes } from '@angular/router';

import { DirectoryListComponent } from './resources-and-contacts-directory/presentation/directory-list/directory-list';

export const routes: Routes = [
  {
    path: 'directorio',
    component: DirectoryListComponent
  },

  {
    path: '',
    redirectTo: '/directorio',
    pathMatch: 'full'
  }
];
