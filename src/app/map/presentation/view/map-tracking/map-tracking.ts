import { Component, OnDestroy, OnInit, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule, GoogleMap, MapMarkerClusterer } from '@angular/google-maps';
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
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-map-tracking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GoogleMapsModule,
    MapMarkerClusterer,
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
export class MapTrackingComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap) map!: GoogleMap;

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
  ) {}

  ngOnInit(): void {
    this.subscribeToStore();
    this.loadComplaintsFromAPI();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToStore(): void {
    this.subscriptions.add(
      this.mapStore.filteredMarkers$.subscribe(markers => {
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
    const apiUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderMapComplaintsEndpointPath}`;

    this.http.get<any>(apiUrl)
      .subscribe({
        next: (response) => {
          const complaints = Array.isArray(response) ? response : response.complaints;

          if (complaints && complaints.length > 0) {
            this.mapStore.loadComplaintsAsMarkers(complaints);
            this.loadFilterOptions();
          } else {
            this.triggerMapResize();
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cargando mapa:', error);
          this.loading = false;
        }
      });
  }

  private loadFilterOptions(): void {
    this.categories = this.mapStore.getUniqueCategories();
    this.districts = this.mapStore.getUniqueDistricts();
    this.statuses = this.mapStore.getUniqueStatuses();
  }

  private updateMapView(): void {
    if (this.filteredMarkers.length === 0) {
      this.center = { lat: -12.0464, lng: -77.0428 };
      this.zoom = 6;
      this.triggerMapResize();
      return;
    }

    const validMarkers = this.filteredMarkers.filter(marker =>
      marker.position.lat !== 0 && marker.position.lng !== 0
    );

    if (validMarkers.length === 0) {
      this.triggerMapResize();
      return;
    }

    const avgLat = validMarkers.reduce((sum, m) => sum + m.position.lat, 0) / validMarkers.length;
    const avgLng = validMarkers.reduce((sum, m) => sum + m.position.lng, 0) / validMarkers.length;

    this.center = {
      lat: parseFloat(avgLat.toFixed(6)),
      lng: parseFloat(avgLng.toFixed(6))
    };

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

    this.triggerMapResize();
  }

  private triggerMapResize(): void {
    setTimeout(() => {
      if (this.map && this.map.googleMap) {
        google.maps.event.trigger(this.map.googleMap, 'resize');
        this.map.googleMap.setCenter(this.center);
      }
    }, 100);
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
    if (this.selectedCategory) filters.categories = [this.selectedCategory];
    if (this.selectedDistrict) filters.districts = [this.selectedDistrict];
    if (this.selectedStatus) filters.statuses = [this.selectedStatus];
    this.mapStore.applyFilters(filters);
    this.triggerMapResize();
  }

  filterComplaints(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedDistrict = '';
    this.selectedStatus = '';
    this.mapStore.resetFilters();
    this.triggerMapResize();
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
