
export interface ResponsibleResource{
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  position?: string;
  department?: string;
  phone: string;
  role: string;
  description: string;
  accessLevel: string;
  status: 'active' | 'inactive';
  assignedComplaints?: string[];
  createdAt: string;
}

export interface ResponsibleResponse{
  responsible: ResponsibleResource;
}

export interface ResponsiblesResponse{
  responsibles: ResponsibleResource[];
}
