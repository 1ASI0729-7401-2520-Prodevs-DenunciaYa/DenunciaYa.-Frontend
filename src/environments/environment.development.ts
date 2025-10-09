export const environment = {
  production: true,
  platformProviderApiBaseUrl: 'http://localhost:3001/api/v1',
  platformProviderCommunitiesEndpointPath: '/communities',
  platformProviderResponsiblesEndpointPath: '/responsibles',

  apiBaseUrl: 'https://denunciaya-fakeapi.onrender.com/',

  apiEndpoints: {
    complaints: '/complaints',
    citizens: '/citizens',
    authorities: '/authorities'
  },

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
