import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import {Responsible} from '../domain/model/responsibleCreate,entity';
import { ResponsibleResponse, ResponsiblesResponse, ResponsibleResource } from './responsibleCreate.response';

export class ResponsibleAssembler
  implements BaseAssembler<Responsible, ResponsibleResource, ResponsiblesResponse>
{
  toEntitiesFromResponse(response: ResponsiblesResponse): Responsible[] {
    return response.responsibles.map(resource =>
      this.toEntityFromResource(resource as ResponsibleResource)
    );
  }

  toEntityFromResource(resource: ResponsibleResource): Responsible {
    return new Responsible({
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      email: resource.email,
      phone: resource.phone,
      role: resource.role,
      description: resource.description ?? [],
      accessLevel: resource.accessLevel,
      createdAt: new Date(resource.createdAt),
    });
  }

  toResourceFromEntity(entity: Responsible): ResponsibleResource {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      phone: entity.phone,
      role: entity.role,
      description: entity.description,
      accessLevel: entity.accessLevel,
      createdAt: entity.createdAt.toISOString(),
    } as ResponsibleResource;
  }
}
