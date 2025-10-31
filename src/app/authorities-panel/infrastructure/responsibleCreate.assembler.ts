import { Responsible } from '../domain/model/responsibleCreate.entity';
import { ResponsibleResource, ResponsiblesResponse } from './responsibleCreate.response';

/**
 * @class Responsible
 * @summary Handles the transformation between Responsible entities and ResponsibleResource / ResponsiblesResponse objects.
 * It provides methods to convert from response objects to entities and vice versa.
 * @method toEntitiesFromResponse - Converts a ResponsiblesResponse into an array of Responsible entities.
 * @method toEntityFromResource - Converts a ResponsibleResource into a Responsible entity.
 * @method toResourceFromEntity - Converts a Responsible entity into a ResponsibleResource.
 */
export class ResponsibleAssembler {

  toEntitiesFromResponse(response: ResponsiblesResponse): Responsible[] {
    if (!response || !response.responsibles) return [];
    return response.responsibles.map(resource => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: ResponsibleResource): Responsible {
    return new Responsible({
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      email: resource.email,
      position: resource.position,
      department: resource.department,
      phone: resource.phone,
      role: resource.role,
      description: resource.description,
      accessLevel: resource.accessLevel,
      status:resource.status,
      assignedComplaints: resource.assignedComplaints ?? [],
      createdAt: resource.createdAt ? new Date(resource.createdAt) : new Date(),
    });
  }

  toResourceFromEntity(entity: Responsible): ResponsibleResource {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      fullName: entity.fullName,
      email: entity.email,
      position: entity.position,
      department: entity.department,
      phone: entity.phone,
      role: entity.role,
      description: entity.description,
      accessLevel: entity.accessLevel,
      status: this.formatStatus(entity.status),
      assignedComplaints: entity.assignedComplaints,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  private formatStatus(status: string): 'active' | 'inactive' {
    if (status === 'inactive') return 'inactive';
    return 'active';
  }
}
