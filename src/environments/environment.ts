export const environment = {
  production: false,

  // API Configuration
  platformProviderApiBaseUrl: 'http://localhost:3001/api/v1',
  platformProviderCommunitiesEndpointPath: '/communities',
  platformProviderResponsiblesEndpointPath: '/responsibles',

  apiBaseUrl: 'http://localhost:3000/api',
  apiEndpoints: {
    complaints: '/complaints',
    citizens: '/citizens',
    authorities: '/authorities'
  },

  // Google Maps Configuration
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
