export const environment = {
  production: false,

  // === Fake API (Render) ===
  platformProviderApiBaseUrl: 'https://denunciaya-fakeapi-xf50.onrender.com',

  platformProviderCommunitiesEndpointPath: '/communities',
  platformProviderResponsiblesEndpointPath: '/responsibles',
  platformProviderCitizensEndpointPath: '/citizen',
  platformProviderAuthoritiesEndpointPath: '/authority',
  platformProviderComplaintsEndpointPath: '/complaints',

  // === Backend real local (Spring Boot o similar) ===
  apiBaseUrl: 'http://localhost:3000/api/v1',
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
