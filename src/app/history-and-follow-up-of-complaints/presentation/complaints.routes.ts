import { Routes } from '@angular/router';
import { ComplaintDetailCitizen } from './view/complaint-detail-citizen/complaint-detail-citizen';
import { ComplaintDetailAuthority } from './view/complaint-detail-authority/complaint-detail-authority';

export const complaintsRoutes: Routes = [
  {
    path: 'citizen/complaints/:id',
    component: ComplaintDetailCitizen,
    data: { title: 'Complaint Details - Citizen' }
  },

  {
    path: 'authority/complaints/:id',
    component: ComplaintDetailAuthority,
    data: { title: 'Complaint Details - Authority' }
  },


];
