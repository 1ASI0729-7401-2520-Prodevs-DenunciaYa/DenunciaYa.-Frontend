export class Complaint {
  private _id: string;
  private _category: string;
  private _department: string;
  private _city: string;
  private _district: string;
  private _location: string;
  private _referenceInfo: string;
  private _description: string;
  private _status: 'Pending' | 'Accepted' | 'In Process' | 'Completed' | 'Rejected' | 'Draft' | 'Awaiting response';
  private _priority: 'Standard' | 'Urgent' | 'Critical';
  private _evidence: string[];
  private _assignedTo: string;
  private _updateMessage: string;
  private _updateDate: string;
  private _timeline: TimelineItem[];

  constructor(complaint:Partial<Complaint> = {} ) {
    this._id = '';
    this._category = '';
    this._department = '';
    this._city = '';
    this._district = '';
    this._location = '';
    this._referenceInfo = '';
    this._description = '';
    this._status = 'Pending';
    this._priority = 'Standard';
    this._evidence = [];
    this._assignedTo = 'Not assigned';
    this._updateMessage = '';
    this._updateDate = new Date().toISOString();
    this._timeline = [];
  }

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }
  get category(): string {
    return this._category;
  }
  set category(value: string) {
    this._category = value;
  }
  get department(): string {
    return this._department;
  }
  set department(value: string) {
    this._department = value;
  }
  get city(): string {
    return this._city;
  }
  set city(value: string) {
    this._city = value;
  }
  get district(): string {
    return this._district;
  }
  set district(value: string) {
    this._district = value;
  }
  get location(): string {
    return this._location;
  }
  set location(value: string) {
    this._location = value;
  }
  get referenceInfo(): string {
    return this._referenceInfo;
  }
  set referenceInfo(value: string) {
    this._referenceInfo = value;
  }
  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }
  get status(): 'Pending' | 'Accepted' | 'In Process' | 'Completed' | 'Rejected' | 'Draft' | 'Awaiting response' {
    return this._status;
  }
  set status(value: 'Pending' | 'Accepted' | 'In Process' | 'Completed' | 'Rejected' | 'Draft' | 'Awaiting response') {
    this._status = value;
  }
  get priority(): 'Standard' | 'Urgent' | 'Critical' {
    return this._priority;
  }
  set priority(value: 'Standard' | 'Urgent' | 'Critical') {
    this._priority = value;
  }
  get evidence(): string[] {
    return this._evidence;
  }
  set evidence(value: string[]) {
    this._evidence = value;
  }
  get assignedTo(): string {
    return this._assignedTo;
  }
  set assignedTo(value: string) {
    this._assignedTo = value;
  }
  get updateMessage(): string {
    return this._updateMessage;
  }
  set updateMessage(value: string) {
    this._updateMessage = value;
  }
  get updateDate(): string {
    return this._updateDate;
  }
  set updateDate(value: string) {
    this._updateDate = value;
  }
  get timeline(): TimelineItem[] {
    return this._timeline;
  }
  set timeline(value: TimelineItem[]) {
    this._timeline = value;
  }

}

export interface TimelineItem {
  status: string;
  date: string;
  completed: boolean;
  current: boolean;
  waitingDecision?: boolean;
}


