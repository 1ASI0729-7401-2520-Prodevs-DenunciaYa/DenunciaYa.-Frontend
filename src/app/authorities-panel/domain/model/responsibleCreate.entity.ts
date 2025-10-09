import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Responsible implements BaseEntity {
  private _id: number;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _phone: string;
  private _role: string;
  private _description: string[];
  private _accessLevel: string;
  private _createdAt: Date;

  constructor(responsible: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    description: string[];
    accessLevel: string;
    createdAt?: Date;
  })
  {
    this._id = responsible.id;
    this._firstName = responsible.firstName;
    this._lastName = responsible.lastName;
    this._email = responsible.email;
    this._phone = responsible.phone;
    this._role = responsible.role;
    this._description = responsible.description ?? [];
    this._accessLevel = responsible.accessLevel;
    this._createdAt = responsible.createdAt ?? new Date();
  }

  // --- Getters ---
  get id(): number {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get role(): string {
    return this._role;
  }

  get description(): string[] {
    return this._description;
  }

  get accessLevel(): string {
    return this._accessLevel;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  updateContact(email: string, phone: string): void {
    this._email = email;
    this._phone = phone;
  }

  updateAccessLevel(level: string): void {
    this._accessLevel = level;
  }

  assignDepartments(departments: string[]): void {
    this._description = [...departments];
  }

  changeRole(newRole: string): void {
    this._role = newRole;
  }
}
