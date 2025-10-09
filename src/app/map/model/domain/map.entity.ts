/**
 * @Interface representing a map marker with position, title, category, status, priority, and associated complaint data.
 * @interface MapMarker
 * @property {Object} position - The geographical position of the marker.
 * @property {number} position.lat - The latitude of the marker.
 * @property {number} position.lng - The longitude of the marker.
 * @property {string} title - The title of the marker.
 * @property {string} category - The category of the complaint associated with the marker.
 * @property {string} status - The status of the complaint associated with the marker.
 * @property {string} priority - The priority of the complaint associated with the marker.
 * @property {ComplaintData} complaintData - The detailed complaint data associated with the marker.
 * @author Omar Harold Rivera Ticllacuri
 */
export interface MapMarker {
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  category: string;
  status: string;
  priority: string;
  complaintData: ComplaintData;
}

/**
 * @Interface representing detailed complaint data.
 * @interface ComplaintData
 * @property {string} id - The unique identifier of the complaint.
 * @property {string} category - The category of the complaint.
 * @property {string} department - The department handling the complaint.
 * @property {string} city - The city where the complaint was filed.
 * @property {string} district - The district where the complaint was filed.
 * @property {string} location - The specific location of the complaint.
 * @property {string} referenceInfo - Additional reference information about the complaint.
 * @property {string} description - A detailed description of the complaint.
 * @property {string} status - The current status of the complaint.
 * @property {string} priority - The priority level of the complaint.
 * @property {string[]} evidence - An array of evidence URLs related to the complaint.
 * @property {string} assignedTo - The authority or person assigned to handle the complaint.
 * @property {string} updateMessage - The latest update message regarding the complaint.
 * @property {string} updateDate - The ISO date string of the last update.
 * @property {any[]} timeline - An array representing the timeline of status changes for the complaint.
 * @property {number} [latitude] - Optional latitude of the complaint location.
 * @property {number} [longitude] - Optional longitude of the complaint location.
 * @author Omar Harold Rivera Ticllacuri
 */
export interface ComplaintData {
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
  timeline: any[];
  latitude?: number;
  longitude?: number;
}

/**
 * @Class representing filters for map markers based on categories, districts, statuses, and priorities.
 * @class MapFilter
 * @property {string[]} categories - Array of categories to filter markers.
 * @property {string[]} districts - Array of districts to filter markers.
 * @property {string[]} statuses - Array of statuses to filter markers.
 * @property {string[]} priorities - Array of priorities to filter markers.
 * @author Omar Harold Rivera Ticllacuri
 */
export class MapFilter {
  categories: string[] = [];
  districts: string[] = [];
  statuses: string[] = [];
  priorities: string[] = [];
}
