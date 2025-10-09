export class Complaint {
  id: string;
  category: string;
  department: string;
  city: string;
  district: string;
  location: string;
  referenceInfo: string;
  description: string;
  status: 'Pending' | 'Accepted' | 'In Process' | 'Completed' | 'Rejected' | 'Draft' | 'Awaiting response';
  priority: 'Standard' | 'Urgent' | 'Critical';
  evidence: string[];
  assignedTo: string;
  updateMessage: string;
  updateDate: string;
  timeline: TimelineItem[];

  constructor() {
    this.id = '';
    this.category = '';
    this.department = '';
    this.city = '';
    this.district = '';
    this.location = '';
    this.referenceInfo = '';
    this.description = '';
    this.status = 'Pending';
    this.priority = 'Standard';
    this.evidence = [];
    this.assignedTo = 'Not assigned';
    this.updateMessage = '';
    this.updateDate = new Date().toISOString();
    this.timeline = [];
  }
}

export interface TimelineItem {
  status: string;
  date: string;
  completed: boolean;
  current: boolean;
  waitingDecision?: boolean;
  updateMessage?: string;
}
