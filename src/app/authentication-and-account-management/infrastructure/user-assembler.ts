import { User } from '../domain/model/user.entity';
import { UserResource, UsersResponse } from './users-response';

/**
 * @class UserAssembler
 * @summary Handles the transformation between User entities and UserResource / UsersResponse objects.
 * It provides methods to convert from response objects to entities and vice versa.
 * @author Omar Harold Rivera Ticllacuri
 */
export class UserAssembler {

  /**
   * Converts a nested UsersResponse into a flat array of User entities.
   * Merges both citizens and authorities into a single list.
   * @param {UsersResponse} response - The UsersResponse object containing citizens and authorities
   * @returns {User[]} An array of User entities
   */
  static toEntitiesFromResponse(response: UsersResponse): User[] {
    const citizens = response.users.citizens.map(resource => this.toEntityFromResource(resource));
    const authorities = response.users.authorities.map(resource => this.toEntityFromResource(resource));
    return [...citizens, ...authorities];
  }

  /**
   * Converts a UserResource into a User entity.
   * @param resource The UserResource object.
   * @returns A User entity.
   */
  static toEntityFromResource(resource: UserResource): User {
    const roleMap: Record<UserResource['role'], User['role']> = {
      citizen: 'citizen',
      authority: 'authority'
    };

    return {
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      email: resource.email,
      password: resource.password,
      role: roleMap[resource.role],
      phone: resource.phone,
      plan: resource.plan,
      paymentStatus: resource.paymentStatus,
      terms: resource.terms ?? false
    };
  }

  /**
   * Converts a User entity into a UserResource.
   * @param entity The User entity.
   * @returns A UserResource object.
   */
  static toResourceFromEntity(entity: User): UserResource {
    const roleMap: Record<User['role'], UserResource['role']> = {
      citizen: 'citizen',
      authority: 'authority'
    };

    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      password: entity.password,
      role: roleMap[entity.role],
      phone: entity.phone,
      plan: entity.plan,
      paymentStatus: entity.paymentStatus,
      terms: entity.terms
    };
  }
}
