import {Complaint, TimelineItem} from '../domain/model/complaint.entity';
import {ComplaintResource, ComplaintsResponse, TimelineItemResource} from './complaint-response';
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
    return new Complaint({
      id: resource.id,
      category: resource.category,
      department: resource.department,
      city: resource.city,
      district: resource.district,
      location: resource.location,
      referenceInfo: resource.referenceInfo,
      description: resource.description,
      status: resource.status as Complaint['status'],
      priority: resource.priority as Complaint['priority'],
      evidence: resource.evidence,
      assignedTo: resource.assignedTo,
      updateMessage: resource.updateMessage,
      updateDate: resource.updateDate,
      timeline: resource.timeline ? resource.timeline.map(timelineItem => this.toTimelineItemFromResource(timelineItem)) : []
    });
  }

  static toEntitiesFromResponse(response: ComplaintsResponse): Complaint[] {
    return response.complaints.map(resource => this.toEntityFromResource(resource as ComplaintResource));
  }

  static toTimelineItemFromResource(resource: TimelineItemResource): TimelineItem {
    return {
      status: resource.status,
      date: resource.date,
      completed: resource.completed,
      current: resource.current,
      waitingDecision: (resource as any).waitingDecision
    };
  }

  static toResourceFromEntity(entity: Complaint): ComplaintResource {
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
      evidence: entity.evidence,
      assignedTo: entity.assignedTo,
      updateMessage: entity.updateMessage,
      updateDate: entity.updateDate,
      timeline: entity.timeline.map(item => this.toTimelineItemResource(item))
    };
  }

  static toTimelineItemResource(item: TimelineItem): TimelineItemResource {
    return {
      status: item.status,
      date: item.date,
      completed: item.completed,
      current: item.current,
      waitingDecision: item.waitingDecision

    };
  }
}
