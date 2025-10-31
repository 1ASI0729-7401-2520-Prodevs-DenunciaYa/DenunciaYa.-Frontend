/**
 * @interface ResponsibleResource
 * @summary Represents a responsible individual within the authority panel system
 * * @param {string} id - Unique identifier for the responsible
 * * @param {string} firstName - First name of the responsible
 * * @param {string} lastName - Last name of the responsible
 * * @param {string} [fullName] - Full name of the responsible (optional)
 * * @param {string} email - Email address of the responsible
 * * @param {string} [position] - Position or job title of the responsible (optional)
 * * @param {string} [department] - Department the responsible belongs to (optional)
 * * @param {string} phone - Phone number of the responsible
 * * @param {string} role - Role of the responsible within the system
 * * @param {string} description - Description or notes about the responsible
 * * @param {string} accessLevel - Access level assigned to the responsible
 * * @param {'active' | 'inactive'} status - Current status of the responsible
 * * @param {string[]} [assignedComplaints] - Array of complaint IDs assigned to the responsible (optional)
 * * @param {string} createdAt - Timestamp of when the responsible was created
 */
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
