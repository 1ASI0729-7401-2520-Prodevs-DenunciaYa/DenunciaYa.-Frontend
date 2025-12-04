import {Complaint, TimelineItem} from '../domain/model/complaint.entity';
import {ComplaintResource, ComplaintsResponse, TimelineItemResource, EvidenceResource} from './complaint-response';

export class ComplaintAssembler {

  static toEntityFromResource(resource: any): Complaint {
    console.log('Raw resource from backend:', resource);

    // Manejar diferentes estructuras del backend
    const id = resource.id || resource.complaintId || '';

    console.log('Mapped ID from backend:', id);
    // Mapear los estados del backend al frontend
    const backendStatus = resource.status || '';
    let frontendStatus: Complaint['status'] = 'Pending';

    switch (backendStatus.toLowerCase()) {
      case 'pending':
        frontendStatus = 'Pending';
        break;
      case 'accepted':
      case 'in_process':
        frontendStatus = 'In Process';
        break;
      case 'completed':
        frontendStatus = 'Completed';
        break;
      case 'rejected':
        frontendStatus = 'Rejected';
        break;
      case 'draft':
        frontendStatus = 'Draft';
        break;
      case 'awaiting_response':
        frontendStatus = 'Awaiting response';
        break;
      default:
        frontendStatus = 'Pending';
    }

    // Mapear prioridades
    const backendPriority = resource.priority || '';
    let frontendPriority: Complaint['priority'] = 'Standard';

    switch (backendPriority.toLowerCase()) {
      case 'standard':
        frontendPriority = 'Standard';
        break;
      case 'urgent':
        frontendPriority = 'Urgent';
        break;
      case 'critical':
        frontendPriority = 'Critical';
        break;
      default:
        frontendPriority = 'Standard';
    }

    // Obtener evidencias - manejar diferentes estructuras
    let evidenceUrls: string[] = [];
    if (Array.isArray(resource.evidence)) {
      evidenceUrls = resource.evidence;
    } else if (Array.isArray(resource.evidences)) {
      evidenceUrls = resource.evidences.map((e: any) => e.url || '').filter(Boolean);
    }

    // Obtener timeline del backend
    const timelineItems: TimelineItem[] = [];
    if (Array.isArray(resource.timeline)) {
      resource.timeline.forEach((item: any, index: number) => {
        timelineItems.push({
          id: item.id || index + 1,
          status: item.status || '',
          date: item.date || new Date().toISOString(),
          completed: Boolean(item.completed),
          current: Boolean(item.current),
          waitingDecision: Boolean(item.waitingDecision),
          updateMessage: item.updateMessage || ''
        });
      });
    }

    return new Complaint({
      id,
      category: resource.category || '',
      department: resource.department || '',
      city: resource.city || '',
      district: resource.district || '',
      location: resource.location || '',
      referenceInfo: resource.referenceInfo || '',
      description: resource.description || '',
      status: frontendStatus,
      priority: frontendPriority,
      evidence: evidenceUrls,
      assignedTo: resource.assignedTo || 'Not assigned',
      responsibleId: resource.responsibleId || null,
      updateMessage: resource.updateMessage || '',
      updateDate: resource.updateDate || new Date().toISOString(),
      timeline: timelineItems
    });
  }

  static toEntitiesFromResponse(response: ComplaintsResponse): Complaint[] {
    return response.complaints.map(resource => this.toEntityFromResource(resource as ComplaintResource));
  }

  static toTimelineItemFromResource(resource: TimelineItemResource): TimelineItem {
    return {
      id: (resource as any).id,
      status: resource.status,
      date: resource.date,
      completed: !!resource.completed,
      current: !!resource.current,
      waitingDecision: (resource as any).waitingDecision ?? false,
      updateMessage: (resource as any).updateMessage ?? ''
    };
  }

  static toResourceFromEntity(entity: Complaint): any {
    // Convertir estados del frontend al backend
    const backendStatus = this.mapStatusToBackend(entity.status);
    const backendPriority = this.mapPriorityToBackend(entity.priority);
    let frontendStatus: Complaint['status'] = 'Pending';
    switch (backendStatus.toLowerCase()) {
      case 'pending':
        frontendStatus = 'Pending';
        break;
      case 'in_process':
      case 'in process': // ¡AMBOS FORMATOS!
        frontendStatus = 'In Process';
        break;
      case 'completed':
        frontendStatus = 'Completed';
        break;
      case 'rejected':
        frontendStatus = 'Rejected';
        break;
      case 'awaiting_response':
      case 'awaiting response': // ¡AMBOS FORMATOS!
        frontendStatus = 'Awaiting response';
        break;
      default:
        frontendStatus = 'Pending';
    }
    return {
      id: entity.id,
      complaintId: entity.id,
      category: entity.category,
      department: entity.department,
      city: entity.city,
      district: entity.district,
      location: entity.location,
      referenceInfo: entity.referenceInfo || '',
      description: entity.description,
      status: backendStatus,
      priority: backendPriority,
      evidence: Array.isArray(entity.evidence) ? entity.evidence : [],
      assignedTo: entity.assignedTo,
      responsibleId: entity.responsibleId ?? null,
      updateMessage: entity.updateMessage || '',
      updateDate: entity.updateDate || new Date().toISOString(),
      timeline: entity.timeline.map(item => this.toTimelineItemResource(item))
    };
  }


  private static mapStatusToBackend(frontendStatus: Complaint['status']): string {
    console.log('🔍 mapStatusToBackend - frontendStatus:', frontendStatus);

    switch (frontendStatus) {
      case 'Pending': return 'PENDING';
      case 'In Process': return 'IN_PROCESS'; // ¡CORREGIDO!
      case 'Completed': return 'COMPLETED';
      case 'Rejected': return 'REJECTED';
      case 'Awaiting response': return 'AWAITING_RESPONSE';
      // Quitar 'Accepted' y 'Draft' que no existen
      default: return 'PENDING';
    }
  }

  private static mapPriorityToBackend(frontendPriority: Complaint['priority']): string {
    switch (frontendPriority) {
      case 'Standard': return 'STANDARD';
      case 'Urgent': return 'URGENT';
      case 'Critical': return 'CRITICAL';
      default: return 'STANDARD';
    }
  }

  static toTimelineItemResource(item: TimelineItem): TimelineItemResource {
    const payload: any = {
      id: item.id,
      status: item.status,
      date: item.date,
      completed: !!item.completed,
      current: !!item.current,
      waitingDecision: !!item.waitingDecision,
      updateMessage: item.updateMessage ?? ''
    };
    return payload as TimelineItemResource;
  }
}
