export const environment = {
  production: false,

  // === Fake API (Render) ===
  // En desarrollo usamos ruta relativa para que el dev-server pueda proxear a localhost:8080 y evitar CORS
  // Para desarrollo local usar directamente el backend para evitar 404s en /api/v1
  platformProviderApiBaseUrl: 'http://localhost:8080/api/v1',

  platformProviderCommunitiesEndpointPath: '/communities',
  platformProviderResponsiblesEndpointPath: '/responsibles',
  platformProviderCitizensEndpointPath: '/citizen',
  platformProviderAuthoritiesEndpointPath: '/authority',
  platformProviderComplaintsEndpointPath: '/complaints',
  platformProviderMapComplaintsEndpointPath: '/map/complaints',
  platformProviderAssignmentsEndpointPath: '/complaintAssignments',

  // === Backend real local (Spring Boot o similar) ===
  apiBaseUrl: 'http://localhost:8080/api/v1',
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
