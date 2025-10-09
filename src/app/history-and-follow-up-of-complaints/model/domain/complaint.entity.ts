/**
 * Complaint entity representing a complaint record.
 * This class encapsulates all relevant details of a complaint.
 *
 * @class Complaint
 * @property {string} id - Unique identifier for the complaint.
 * @property {string} category - Category of the complaint.
 * @property {string} department - Department where the complaint occurred.
 * @property {string} city - City of the complaint.
 * @property {string} district - District of the complaint.
 * @property {string} location - Specific address or location.
 * @property {string} referenceInfo - Additional reference information from the user.
 * @property {string} description - Detailed description of the complaint.
 * @property {'Pending' | 'Accepted' | 'In Process' | 'Completed' | 'Rejected' | 'Draft' | 'Awaiting response'} status - Current status of the complaint.
 * @property {'Standard' | 'Urgent' | 'Critical'} priority - Priority level of the complaint.
 * @property {string[]} evidence - Array of evidence URLs.
 * @property {string} assignedTo - Responsible authority or person.
 * @property {string} updateMessage - Latest update message.
 * @property {string} updateDate - ISO date string for the last update.
 * @property {TimelineItem[]} timeline - Timeline of status changes.
 *
 * @author
 * Omar Harold Rivera Ticllacuri
 */
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

/**
 * TimelineItem interface representing a status update in the complaint's timeline.
 * This interface captures the details of each status change.
 * @interface TimelineItem
 * @property {string} status - Status description.
 * @property {string} date - ISO date string of the status update.
 * @property {boolean} completed - Indicates if the status is completed.
 * @property {boolean} current - Indicates if this is the current status.
 * @property {boolean} [waitingDecision] - Optional flag for statuses awaiting user decision.
 * @property {string} [updateMessage] - Optional message associated with the status update.
 * @author Omar Harold Rivera Ticllacuri
 */
export interface TimelineItem {
  status: string;
  date: string;
  completed: boolean;
  current: boolean;
  waitingDecision?: boolean;
  updateMessage?: string;
}
