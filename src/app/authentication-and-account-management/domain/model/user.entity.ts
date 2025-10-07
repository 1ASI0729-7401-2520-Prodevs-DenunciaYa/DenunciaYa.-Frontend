/**
 * User entity representing a user in the system.
 * Includes properties for id, name, contact info, role, and optional plan details.
 * Role can be either 'authority' or 'citizen'.
 * @param id Unique identifier for the user (string or number).
 * @param firstName User's first name.
 * @param lastName User's last name.
 * @param email User's email address.
 * @param password User's password.
 * @param role Role of the user, either 'authority' or 'citizen'.
 * @param plan Optional payment plan for authority users, either 'basic' or 'premium'.
 * @param paymentStatus Optional payment status for authority users, either 'pending' or 'completed'.
 * @param phone Optional phone number as a string.
 * @param terms Boolean indicating if the user has accepted terms and conditions.
 * @summary User entity
 * @author Omar Harold Rivera Ticllacuri
 */
export class User {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'authority' | 'citizen';
  plan?: 'basic' | 'premium';
  paymentStatus?: 'pending' | 'completed';
  phone?: string;
  terms: boolean;

  /**
   * Creates a new User instance with default values.
   * 
   */
  constructor() {
    this.id = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.role = 'citizen';
    this.plan = undefined;
    this.paymentStatus = undefined;
    this.phone = '';
    this.terms = false;
  }
}
