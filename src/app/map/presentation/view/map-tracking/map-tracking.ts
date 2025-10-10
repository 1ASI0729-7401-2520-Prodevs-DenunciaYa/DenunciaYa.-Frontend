import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MapStore } from '../../../application/map.store';
import { MapFilter, MapMarker } from '../../../model/domain/map.entity';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DistrictCoordinatesService } from '../../../infrastructure/district-coordinates.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-map-tracking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GoogleMapsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    TranslatePipe
  ],
  templateUrl: './map-tracking.html',
  styleUrls: ['./map-tracking.css'],
})
/** @class MapTrackingComponent
 * @summary Component for displaying and filtering complaints on a Google Map.
 * @method ngOnInit - Initializes the component and subscribes to the store.
 * @method ngOnDestroy - Cleans up subscriptions on component destruction.
 * @method loadComplaintsFromAPI - Fetches complaints from the API and loads them into the store.
 * @method applyFilters - Applies selected filters to the map markers.
 * @method resetFilters - Resets all filters to show all markers.
 * @method getMarkerIcon - Returns the appropriate marker icon based on complaint status.
 * @method getStatusBadgeClass - Returns CSS class for status badge.
 * @method getPriorityBadgeClass - Returns CSS class for priority badge.
 * @method openImage - Opens the complaint image in a new tab.
 * @method trackByMarkerId - TrackBy function for optimizing ngFor rendering.
 * @author Omar Harold Rivera Ticllacuri
 */
export class MapTrackingComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  mapStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ];

  filteredMarkers: MapMarker[] = [];
  loading = false;

  center = { lat: -12.0464, lng: -77.0428 };
  zoom = 6;

  selectedCategory: string = '';
  selectedDistrict: string = '';
  selectedStatus: string = '';

  categories: string[] = [];
  districts: string[] = [];
  statuses: string[] = [];

  constructor(
    private mapStore: MapStore,
    private http: HttpClient,
    private districtService: DistrictCoordinatesService,
    @Inject('googleMapsApiKey') private googleMapsApiKey: string
  ) {
    console.log('Google Maps API Key:', this.googleMapsApiKey ? 'Present' : 'Missing');
  }

  ngOnInit(): void {
    this.subscribeToStore();
    this.loadComplaintsFromAPI();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * @method subscribeToStore
   * @summary Subscribes to the MapStore observables to get filtered markers and loading state.
   * @returns {void}
   * @author Omar Harold Rivera Ticllacuri
   */
  private subscribeToStore(): void {
    this.subscriptions.add(
      this.mapStore.filteredMarkers$.subscribe(markers => {
        console.log('Filtered markers received:', markers.length);
        this.filteredMarkers = markers;
        this.updateMapView();
      })
    );

    this.subscriptions.add(
      this.mapStore.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );
  }

  loadComplaintsFromAPI(): void {
    this.loading = true;
    this.http.get<any>('https://denunciaya-fakeapi.onrender.com/complaints')
      .subscribe({
        next: (response) => {
          console.log('✅ Data loaded successfully');
          const complaints = Array.isArray(response) ? response : response.complaints;
          if (complaints && complaints.length > 0) {
            this.mapStore.loadComplaintsAsMarkers(complaints);
            this.loadFilterOptions();
          } else {
            console.error('No valid complaints found');
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading complaints:', error);
          this.loading = false;
        }
      });
  }

  private loadFilterOptions(): void {
    this.categories = this.mapStore.getUniqueCategories();
    this.districts = this.mapStore.getUniqueDistricts();
    this.statuses = this.mapStore.getUniqueStatuses();

    console.log(' Filter options loaded:');
    console.log('  - Categories:', this.categories);
    console.log('  - Districts:', this.districts);
    console.log('  - Statuses:', this.statuses);
  }

  private updateMapView(): void {
    if (this.filteredMarkers.length === 0) {
      console.log('⚠No markers to display');
      this.center = { lat: -12.0464, lng: -77.0428 };
      this.zoom = 6;
      return;
    }

    const validMarkers = this.filteredMarkers.filter(marker =>
      marker.position.lat !== 0 && marker.position.lng !== 0
    );

    if (validMarkers.length === 0) {
      console.log('No markers with valid coordinates');
      return;
    }

    const avgLat = validMarkers.reduce((sum, m) => sum + m.position.lat, 0) / validMarkers.length;
    const avgLng = validMarkers.reduce((sum, m) => sum + m.position.lng, 0) / validMarkers.length;

    this.center = {
      lat: parseFloat(avgLat.toFixed(6)),
      lng: parseFloat(avgLng.toFixed(6))
    };

    console.log('Map center updated:', this.center);

    if (this.filteredMarkers.length === 1) {
      this.zoom = 15;
    } else if (this.filteredMarkers.length <= 5) {
      this.zoom = 12;
    } else if (this.filteredMarkers.length <= 10) {
      this.zoom = 10;
    } else if (this.filteredMarkers.length <= 20) {
      this.zoom = 8;
    } else {
      this.zoom = 6;
    }

    console.log('🔍 Zoom updated:', this.zoom);
  }

  getMarkerIcon(status: string): google.maps.Icon {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';

    const statusIcons: { [key: string]: string } = {
      'Completed': 'green-dot.png',
      'Pending': 'yellow-dot.png',
      'Awaiting response': 'blue-dot.png',
      'Rejected': 'red-dot.png',
      'In Process': 'orange-dot.png',
      'Accepted': 'lightblue-dot.png',
      'Draft': 'pink-dot.png',
      'Decision pending': 'purple-dot.png',
      'Under review': 'orange-dot.png'
    };

    const iconName = statusIcons[status] || 'red-dot.png';

    return {
      url: baseUrl + iconName,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16)
    };
  }

  applyFilters(): void {
    const filters = new MapFilter();

    if (this.selectedCategory) {
      filters.categories = [this.selectedCategory];
    }

    if (this.selectedDistrict) {
      filters.districts = [this.selectedDistrict];
    }

    if (this.selectedStatus) {
      filters.statuses = [this.selectedStatus];
    }

    console.log('🎯 Applying filters:', {
      category: this.selectedCategory,
      district: this.selectedDistrict,
      status: this.selectedStatus
    });

    this.mapStore.applyFilters(filters);
  }

  filterComplaints(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedDistrict = '';
    this.selectedStatus = '';
    this.mapStore.resetFilters();
  }

  getStatusBadgeClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  getPriorityBadgeClass(priority: string): string {
    return priority.toLowerCase();
  }

  openImage(imageUrl: string): void {
    window.open(imageUrl, '_blank');
  }

  trackByMarkerId(index: number, marker: MapMarker): string {
    return marker.complaintData.id;
  }
}
