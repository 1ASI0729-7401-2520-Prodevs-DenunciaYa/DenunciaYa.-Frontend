/**
 * @class Responsible
 * @summary Entity representing a responsible authority in the complaint management system.
 * @property {string} id - Unique identifier for the responsible.
 * @property {string} firstName - First name of the responsible.
 * @property {string} lastName - Last name of the responsible.
 * @property {string} fullName - Full name of the responsible (computed from first and last name).
 * @property {string} email - Email address of the responsible.
 * @property {string} position - Position or job title of the responsible.
 * @property {string} department - Department the responsible belongs to.
 * @property {string} phone - Contact phone number of the responsible.
 * @property {string} role - Role of the responsible within the organization.
 * @property {string} description - Description or notes about the responsible.
 * @property {string} accessLevel - Access level assigned to the responsible.
 * @property {'active' | 'inactive'} status - Current status of the responsible.
 * @property {string[]} assignedComplaints - List of complaint IDs assigned to the responsible.
 * @property {Date} createdAt - Timestamp of when the responsible was created.
 */
export class Responsible {
  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _fullName: string;
  private _email: string;
  private _position: string;
  private _department: string;
  private _phone: string;
  private _role: string;
  private _description: string;
  private _accessLevel: string;
  private _status: 'active' | 'inactive';
  private _assignedComplaints: string[];
  private _createdAt: Date;

  constructor(responsible: Partial<Responsible> = {}) {
    this._id = responsible.id ?? '';
    this._firstName = responsible.firstName ?? '';
    this._lastName = responsible.lastName ?? '';
    this._fullName = responsible.fullName ?? `${this._firstName} ${this._lastName}`;
    this._email = responsible.email ?? '';
    this._position = responsible.position ?? '';
    this._department = responsible.department ?? '';
    this._phone = responsible.phone ?? '';
    this._role = responsible.role ?? '';
    this._description = responsible.description ?? '';
    this._accessLevel = responsible.accessLevel ?? '';
    this._status = 'active';
    this._assignedComplaints = responsible.assignedComplaints ?? [];
    this._createdAt = responsible.createdAt ?? new Date();
  }

  get id(): string { return this._id; }
  set id(value: string) { this._id = value; }

  get firstName(): string { return this._firstName; }
  set firstName(value: string) {
    this._firstName = value;
    this.updateFullName();
  }

  get lastName(): string { return this._lastName; }
  set lastName(value: string) {
    this._lastName = value;
    this.updateFullName();
  }

  get fullName(): string { return this._fullName; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get position(): string { return this._position; }
  set position(value: string) { this._position = value; }

  get department(): string { return this._department; }
  set department(value: string) { this._department = value; }

  get phone(): string { return this._phone; }
  set phone(value: string) { this._phone = value; }

  get role(): string { return this._role; }
  set role(value: string) { this._role = value; }

  get description(): string { return this._description; }
  set description(value: string) { this._description = value; }

  get accessLevel(): string { return this._accessLevel; }
  set accessLevel(value: string) { this._accessLevel = value; }

  get status(): 'active' | 'inactive' {
    return this._status;
  }

  set status(value: 'active' | 'inactive') {
    this._status = value;
  }
  get assignedComplaints(): string[] { return this._assignedComplaints; }
  set assignedComplaints(value: string[]) { this._assignedComplaints = value; }

  get createdAt(): Date { return this._createdAt; }
  set createdAt(value: Date) { this._createdAt = value; }

  private updateFullName(): void {
    const names = [this._firstName, this._lastName].filter(Boolean);
    this._fullName = names.join(' ') || 'Sin nombre';
  }

  addComplaint(complaintId: string): void {
    if (!this._assignedComplaints.includes(complaintId)) {
      this._assignedComplaints.push(complaintId);
    }
  }

  removeComplaint(complaintId: string): void {
    this._assignedComplaints = this._assignedComplaints.filter(id => id !== complaintId);
  }

  getComplaintCount(): number {
    return this._assignedComplaints.length;
  }
}
