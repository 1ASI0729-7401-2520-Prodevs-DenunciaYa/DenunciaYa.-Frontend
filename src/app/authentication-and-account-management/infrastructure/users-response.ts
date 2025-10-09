/**
 * @interface UsersResponse
 * @summary Response structure for fetching users in the system
 * @author Omar Harold Rivera Ticllacuri
 *
 * @param {Object} users - Object containing arrays of users
 * @param {UserResource[]} users.citizens - Array of citizen users
 * @param {UserResource[]} users.authorities - Array of authority users
 */
export interface UsersResponse {
  users: {
    citizens: UserResource[];
    authorities: UserResource[];
  };
}

/**
 * @interface UserResource
 * @summary Represents a user in the system, either a citizen or an authority
 *
 *
 * @param {string | number} id - Unique identifier of the user
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {'citizen' | 'authority'} role - Role of the user in the system
 * @param {string} [phone] - Optional phone number
 * @param {boolean} [terms] - Optional boolean indicating if user accepted terms
 * @param {'basic' | 'premium'} [plan] - Optional plan for authority users
 * @param {'pending' | 'completed'} [paymentStatus] - Optional payment status for authority users
 * @author Omar Harold Rivera Ticllacuri
 */
export interface UserResource {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'citizen' | 'authority';
  phone?: string;
  terms?: boolean;
  plan?: 'basic' | 'premium';
  paymentStatus?: 'pending' | 'completed';
}
