import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ResponsibleResource extends BaseResource {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  description: string[];
  accessLevel: string;
  createdAt: string;
}

export interface ResponsibleResponse extends BaseResponse {
  responsible: ResponsibleResource;
}

export interface ResponsiblesResponse extends BaseResponse {
  responsibles: ResponsibleResource[];
}
