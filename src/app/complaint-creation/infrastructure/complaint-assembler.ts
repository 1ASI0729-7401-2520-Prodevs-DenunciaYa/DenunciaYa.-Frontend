import {Complaint, TimelineItem} from '../domain/model/complaint.entity';
import {ComplaintResource, ComplaintsResponse, TimelineItemResource, EvidenceResource} from './complaint-response';

export class ComplaintAssembler {

  static toEntityFromResource(resource: any): Complaint {
    console.log('🔍 Assembler - Raw resource from backend:', resource);

    const id = resource.id || resource.complaintId || '';
    console.log('🔍 Assembler - Mapped ID:', id);

    // Mapear estados del backend al frontend
    const backendStatus = resource.status || '';
    let frontendStatus: Complaint['status'] = 'Pending';

    console.log('🔍 Assembler - Backend status:', backendStatus);

    // Mapeo completo según ComplaintStatus.java
    switch (backendStatus.toLowerCase()) {
      case 'pending':
      case 'pending': // backend: PENDING
        frontendStatus = 'Pending';
        break;
      case 'in_process':
      case 'in process':
      case 'in_process': // backend: IN_PROCESS
        frontendStatus = 'In Process';
        break;
      case 'completed':
      case 'completed': // backend: COMPLETED
        frontendStatus = 'Completed';
        break;
      case 'rejected':
      case 'rejected': // backend: REJECTED
        frontendStatus = 'Rejected';
        break;
      case 'awaiting_response':
      case 'awaiting response':
      case 'awaiting_response': // backend: AWAITING_RESPONSE
        frontendStatus = 'Awaiting Response';
        break;
      case 'accepted':
      case 'accepted': // backend: ACCEPTED
        frontendStatus = 'Accepted';
        break;
      case 'under_review':
      case 'under review': // backend: UNDER_REVIEW
        frontendStatus = 'Under Review';
        break;
      default:
        console.warn('⚠️ Assembler - Unknown backend status:', backendStatus, 'defaulting to Pending');
        frontendStatus = 'Pending';
    }

    console.log('🔍 Assembler - Mapped frontend status:', frontendStatus);

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

    // Obtener evidencias
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

  static toResourceFromEntity(entity: Complaint): any {
    console.log('🔍 Assembler - Converting entity to resource, entity status:', entity.status);

    // Convertir estados del frontend al backend (valores exactos del enum Java)
    const backendStatus = this.mapStatusToBackend(entity.status);
    const backendPriority = this.mapPriorityToBackend(entity.priority);

    console.log('🔍 Assembler - Mapped backend status:', backendStatus);
    console.log('🔍 Assembler - Mapped backend priority:', backendPriority);

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
      status: backendStatus, // Enviar el valor correcto al backend
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

    // Mapeo exacto según el enum ComplaintStatus.java
    switch (frontendStatus) {
      case 'Pending':
        return 'PENDING';
      case 'In Process':
        return 'IN_PROCESS';
      case 'Completed':
        return 'COMPLETED';
      case 'Rejected':
        return 'REJECTED';
      case 'Awaiting Response':
        return 'AWAITING_RESPONSE';
      case 'Accepted':
        return 'ACCEPTED';
      case 'Under Review':
        return 'UNDER_REVIEW';
      default:
        console.warn('⚠️ Estado no reconocido:', frontendStatus);
        return 'PENDING';
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
