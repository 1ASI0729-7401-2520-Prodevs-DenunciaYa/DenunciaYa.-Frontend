/**
 * @interface ComplaintsResponse
 * @summary Represents the response structure for multiple complaints.
 * @property {ComplaintResource[]} complaints - An array of complaint resources.
 */
export interface ComplaintsResponse {
  complaints: ComplaintResource[];
}

/**
 * @interface EvidenceResource
 * @summary Represents the resource structure for evidence related to a complaint.
 * @property {string} id - The unique identifier of the evidence.
 * @property {string} complaintId - The identifier of the associated complaint.
 * @property {string} url - The URL where the evidence is stored.
 * @property {string} uploadDate - The date when the evidence was uploaded.
 * @property {string | null} description - A description of the evidence (optional).
 * @property {string | null} fileName - The name of the evidence file (optional).
 * @property {string | null} fileType - The type of the evidence file (optional).
 * @property {number | null} fileSize - The size of the evidence file in bytes (optional).
 */
export interface EvidenceResource {
  id: string;
  complaintId: string;
  url: string;
  uploadDate: string;
  description: string | null;
  fileName: string | null;
  fileType: string | null;
  fileSize: number | null;
}

/**
 * @interface ComplaintResource
 * @summary Represents the resource structure for a complaint.
 * @property {string} id - The unique identifier of the complaint.
 * @property {string} category - The category of the complaint.
 * @property {string} department - The department related to the complaint.
 * @property {string} city - The city where the complaint is filed.
 * @property {string} district - The district related to the complaint.
 * @property {string} location - The specific location of the complaint.
 * @property {string} referenceInfo - Additional reference information for the complaint.
 * @property {string} description - A detailed description of the complaint.
 * @property {string} status - The current status of the complaint.
 * @property {string} priority - The priority level of the complaint.
 * @property {string[]} evidence - An array of evidence URLs related to the complaint.
 * @property {string} assignedTo - The person assigned to handle the complaint.
 * @property {string} updateMessage - The latest update message for the complaint.
 * @property {string} updateDate - The date of the latest update.
 * @property {TimelineItemResource[]} timeline - An array representing the timeline of the complaint.
 */
export interface ComplaintResource {
  id: string;
  category: string;
  department: string;
  city: string;
  district: string;
  location: string;
  referenceInfo: string;
  description: string;
  status: string;
  priority: string;
  evidence: string[];
  evidences?: EvidenceResource[];
  assignedTo: string | null;
  responsibleId: string | null;
  updateMessage: string;
  updateDate: string;
  timeline: TimelineItemResource[];
}

/**
 * @interface TimelineItemResource
 * @summary Represents a timeline item in the complaint process.
 * @property {string} id - The unique identifier of the timeline item.
 * @property {string} status - The status at this point in the timeline.
 * @property {string} date - The date of this timeline event.
 * @property {boolean} completed - Indicates if this timeline event is completed.
 * @property {boolean} current - Indicates if this timeline event is the current one.
 * @property {boolean} [waitingDecision] - Optional flag indicating if this event is waiting for a decision.
 * @property {string} [updateMessage] - Optional update message for the timeline item.
 */
export interface TimelineItemResource {
  id: number;
  status: string;
  date: string;
  completed: boolean;
  current: boolean;
  waitingDecision?: boolean;
  updateMessage?: string;
}
