export interface ComplaintsResponse {
  //status: string;
  complaints: ComplaintResource[];
}

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
  assignedTo: string;
  updateMessage: string;
  updateDate: string;
  timeline: TimelineItemResource[];
}

export interface TimelineItemResource {
  status: string;
  date: string;
  completed: boolean;
  current: boolean;
  waitingDecision?: boolean;
}
