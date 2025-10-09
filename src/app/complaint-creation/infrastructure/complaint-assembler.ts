import {Complaint} from '../domain/model/complaint.entity';
import {ComplaintsResponse} from './complaint-response';

export class ComplaintAssembler {
  static toEntityFromResource(resource: ComplaintResource): Complaint {
    return {
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
    };
  }

  static toEntitiesFromResponse(response: ComplaintsResponse): ComplaintsResponse[] {
    return response.complaints.map(resource => this.toEntityFromResource(resource));
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
