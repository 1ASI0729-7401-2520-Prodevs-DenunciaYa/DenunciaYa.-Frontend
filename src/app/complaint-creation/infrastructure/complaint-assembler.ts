import {Complaint, TimelineItem} from '../domain/model/complaint.entity';
import {ComplaintResource, ComplaintsResponse, TimelineItemResource, EvidenceResource} from './complaint-response';
/**
 * This class is responsible for converting between Complaint entities and their corresponding resources.
 * It provides methods to transform data received from the API into domain entities and vice versa.
 * @class ComplaintAssembler
 * @summary Converts between Complaint entities and resources.
 * @param {ComplaintResource} resource - The resource representation of a complaint.
 * @param {ComplaintsResponse} response - The response containing multiple complaint resources.
 * @param {TimelineItemResource} resource - The resource representation of a timeline item.
 * @param {Complaint} entity - The domain entity representation of a complaint.
 * @param {TimelineItem} item - The domain entity representation of a timeline item.
 * @returns {Complaint} The domain entity representation of the complaint.
 * @returns {Complaint[]} An array of domain entity representations of complaints.
 * @returns {TimelineItem} The domain entity representation of the timeline item.
 * @returns {ComplaintResource} The resource representation of the complaint.
 * @returns {TimelineItemResource} The resource representation of the timeline item.
 * @author Omar Harold Rivera Ticllacuri
 */
export class ComplaintAssembler {

  static toEntityFromResource(resource: ComplaintResource): Complaint {
    // Soporta que el backend devuelva 'id' o 'complaintId'. También soporta evidences detalladas.
    const id = (resource as any).id ?? (resource as any).complaintId;
    const evidencesDetailed = (resource as any).evidences as EvidenceResource[] | undefined;
    const evidenceUrls = Array.isArray(evidencesDetailed)
      ? evidencesDetailed.map(e => e.url).filter(Boolean)
      : Array.isArray(resource.evidence) ? resource.evidence : [];

    return new Complaint({
      id,
      category: resource.category,
      department: resource.department,
      city: resource.city,
      district: resource.district,
      location: resource.location,
      referenceInfo: resource.referenceInfo,
      description: resource.description,
      status: resource.status as Complaint['status'],
      priority: resource.priority as Complaint['priority'],
      evidence: evidenceUrls,
      assignedTo: resource.assignedTo ?? 'Not assigned',
      responsibleId: (resource as any).responsibleId ?? null,
      updateMessage: (resource as any).updateMessage ?? '',
      updateDate: (resource as any).updateDate ?? '',
      timeline: Array.isArray(resource.timeline)
        ? resource.timeline.map(timelineItem => this.toTimelineItemFromResource(timelineItem))
        : []
    });
  }

  static toEntitiesFromResponse(response: ComplaintsResponse): Complaint[] {
    return response.complaints.map(resource => this.toEntityFromResource(resource as ComplaintResource));
  }

  static toTimelineItemFromResource(resource: TimelineItemResource): TimelineItem {
    // Ignoramos el id del item en el entity por ahora (no se usa en UI), mantenemos flags opcionales.
    return {
      status: resource.status,
      date: resource.date,
      completed: !!resource.completed,
      current: !!resource.current,
      waitingDecision: (resource as any).waitingDecision ?? false,
      updateMessage: (resource as any).updateMessage ?? ''
    };
  }

  static toResourceFromEntity(entity: Complaint): ComplaintResource {
    // Al enviar desde el front, mantenemos 'id' por compatibilidad; el backend usa el path con complaintId.
    return {
      id: entity.id,
      category: entity.category,
      department: entity.department,
      city: entity.city,
      district: entity.district,
      location: entity.location,
      referenceInfo: entity.referenceInfo,
      description: entity.description,
      status: entity.status,
      priority: entity.priority,
      evidence: Array.isArray(entity.evidence) ? entity.evidence : [],
      assignedTo: entity.assignedTo,
      responsibleId: entity.responsibleId ?? null,
      updateMessage: entity.updateMessage ?? '',
      updateDate: entity.updateDate ?? '',
      timeline: entity.timeline.map(item => this.toTimelineItemResource(item))
    } as ComplaintResource;
  }

  static toTimelineItemResource(item: TimelineItem): TimelineItemResource {
    return {
      id: (undefined as unknown as number),
      status: item.status,
      date: item.date,
      completed: !!item.completed,
      current: !!item.current,
      waitingDecision: !!item.waitingDecision,
      updateMessage: item.updateMessage ?? ''
    } as TimelineItemResource;
  }
}
