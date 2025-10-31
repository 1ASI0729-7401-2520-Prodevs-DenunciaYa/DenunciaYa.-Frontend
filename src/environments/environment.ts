export const environment = {
  production: true,

  // === Fake API (Render) ===
  platformProviderApiBaseUrl: 'http://localhost:3000',

  platformProviderCommunitiesEndpointPath: '/communities',
  platformProviderResponsiblesEndpointPath: '/responsibles',
  platformProviderCitizensEndpointPath: '/citizen',
  platformProviderAuthoritiesEndpointPath: '/authority',
  platformProviderComplaintsEndpointPath: '/complaints',
  platformProviderAssignmentsEndpointPath: '/complaintAssignments',


  // === Backend real local (Spring Boot o similar) ===
  apiBaseUrl: 'http://localhost:3000',
  apiEndpoints: {
    complaints: '/complaints',
    citizens: '/citizen',
    authorities: '/authority'
  },

  // === Google Maps Config ===
  googleMapsApiKey: 'AIzaSyDRrq_VcuuezEAhyUIBhkAV7iZOVqNDnqA',
  mapConfig: {
    defaultCenter: { lat: -12.0464, lng: -77.0428 },
    defaultZoom: 6,
    minZoom: 4,
    maxZoom: 18,
    clusterEnabled: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  }
};
