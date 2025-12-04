export const environment = {
  production: true,

  // === Fake API (Render) ===
  // platformProviderApiBaseUrl: 'https://denunciaya-backend.onrender.com/api/v1',

  // Para desarrollo local temporalmente apuntamos a la ruta relativa `/api/v1`.
  // El dev-server con `proxy.conf.json` reenviará `/api` a http://localhost:8080
  // platformProviderApiBaseUrl: '/api/v1',

  // Apuntar directamente al backend local Swagger para que todo el frontend use
  // http://localhost:8080/api/v1 en lugar de la ruta relativa. Esto evita depender
  // del proxy cuando quieres que el front se comunique con el backend real.
  platformProviderApiBaseUrl: 'https://denunciayaa.onrender.com/api/v1',

  platformProviderCommunitiesEndpointPath: '/communities',
  platformProviderResponsiblesEndpointPath: '/responsibles',
  platformProviderCitizensEndpointPath: '/citizen',
  platformProviderAuthoritiesEndpointPath: '/authority',
  platformProviderComplaintsEndpointPath: '/complaints',
  platformProviderMapComplaintsEndpointPath: '/map/complaints',
  platformProviderAssignmentsEndpointPath: '/complaintAssignments',


  // === Backend real local (Spring Boot o similar) ===
  // apiBaseUrl: 'http://localhost:8080',
  // Normalizamos apiBaseUrl para que incluya el prefijo /api/v1 también.
  apiBaseUrl: 'https://denunciayaa.onrender.com/api/v1',
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
