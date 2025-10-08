import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MapMarker, MapFilter } from '../model/domain/map.entity';
import { DistrictCoordinatesService } from '../infrastructure/district-coordinates.service';

@Injectable({
  providedIn: 'root'
})
/**
 @class MapStore
  @summary State management service for handling map markers and filters.
  @method loadComplaintsAsMarkers - Converts complaints to map markers.
  @method applyFilters - Applies filters to the markers.
  @method resetFilters - Resets filters to show all markers.
  @method getUniqueCategories - Retrieves unique complaint categories.
  @method getUniqueDistricts - Retrieves unique districts from markers.
  @method getUniqueStatuses - Retrieves unique statuses from markers.
  @author Omar Harold Rivera Ticllacuri
   **/
export class MapStore {
  private markersSubject = new BehaviorSubject<MapMarker[]>([]);
  private filteredMarkersSubject = new BehaviorSubject<MapMarker[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public markers$: Observable<MapMarker[]> = this.markersSubject.asObservable();
  public filteredMarkers$: Observable<MapMarker[]> = this.filteredMarkersSubject.asObservable();
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private districtService: DistrictCoordinatesService) {}

  loadComplaintsAsMarkers(complaints: any[]): void {
    this.loadingSubject.next(true);

    console.log('Converting complaints to markers:', complaints.length);

    const markers: MapMarker[] = complaints.map(complaint => {
      let coordinates;
      if (complaint.latitude && complaint.longitude) {
        coordinates = { lat: complaint.latitude, lng: complaint.longitude };
      } else {
        coordinates = this.districtService.generateRandomCoordinatesInDistrict(complaint.district);
      }

      const marker: MapMarker = {
        position: coordinates,
        title: `${complaint.category} - ${complaint.district}`,
        category: complaint.category,
        status: complaint.status,
        priority: complaint.priority,
        complaintData: {
          id: complaint.id,
          category: complaint.category,
          department: complaint.department,
          city: complaint.city,
          district: complaint.district,
          location: complaint.location,
          referenceInfo: complaint.referenceInfo,
          description: complaint.description,
          status: complaint.status,
          priority: complaint.priority,
          evidence: complaint.evidence || [],
          assignedTo: complaint.assignedTo,
          updateMessage: complaint.updateMessage,
          updateDate: complaint.updateDate,
          timeline: complaint.timeline || [],
          latitude: coordinates.lat,
          longitude: coordinates.lng
        }
      };

      return marker;
    });

    console.log('Markers created:', markers.length);
    this.markersSubject.next(markers);
    this.filteredMarkersSubject.next(markers);
    this.loadingSubject.next(false);
  }

  applyFilters(filters: MapFilter): void {
    const currentMarkers = this.markersSubject.value;

    let filtered = currentMarkers.filter(marker => {
      if (filters.categories.length > 0 && !filters.categories.includes(marker.category)) {
        return false;
      }

      if (filters.districts.length > 0 && !filters.districts.includes(marker.complaintData.district)) {
        return false;
      }

      if (filters.statuses.length > 0 && !filters.statuses.includes(marker.status)) {
        return false;
      }

      if (filters.priorities.length > 0 && !filters.priorities.includes(marker.priority)) {
        return false;
      }

      return true;
    });

    console.log('Markers after filtering:', filtered.length);
    this.filteredMarkersSubject.next(filtered);
  }

  resetFilters(): void {
    this.filteredMarkersSubject.next(this.markersSubject.value);
  }

  getUniqueCategories(): string[] {
    const markers = this.markersSubject.value;
    return [...new Set(markers.map(m => m.category))].sort();
  }

  getUniqueDistricts(): string[] {
    const markers = this.markersSubject.value;
    return [...new Set(markers.map(m => m.complaintData.district))].sort();
  }

  getUniqueStatuses(): string[] {
    const markers = this.markersSubject.value;
    return [...new Set(markers.map(m => m.status))].sort();
  }


}
