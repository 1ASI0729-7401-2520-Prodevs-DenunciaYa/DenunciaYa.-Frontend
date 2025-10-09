import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})/**
  * Service to provide geographical coordinates for districts in Peru.
  * It includes a method to generate random coordinates within a specified district.
 * @class DistrictCoordinatesService
 * @summary Provides geographical coordinates for districts in Peru.
 * @method generateRandomCoordinatesInDistrict - Generates random coordinates within a specified district.
 * @return { lat: number, lng: number } - An object containing latitude and longitude.
 * @author Omar Harold Rivera Ticllacuri
  */
export class DistrictCoordinatesService {

  private districtCoordinates: { [key: string]: { lat: number, lng: number } } = {
    // Lima Metropolitan Area
    'Ancón': { lat: -11.7733, lng: -77.1778 },
    'Ate': { lat: -12.0333, lng: -76.9167 },
    'Barranco': { lat: -12.1442, lng: -77.0215 },
    'Breña': { lat: -12.0564, lng: -77.0528 },
    'Carabayllo': { lat: -11.8500, lng: -77.0333 },
    'Chaclacayo': { lat: -11.9833, lng: -76.7667 },
    'Chorrillos': { lat: -12.1833, lng: -77.0167 },
    'Cieneguilla': { lat: -12.1167, lng: -76.8000 },
    'Comas': { lat: -11.9333, lng: -77.0667 },
    'El Agustino': { lat: -12.0500, lng: -77.0000 },
    'Independencia': { lat: -11.9833, lng: -77.0500 },
    'Jesús María': { lat: -12.0833, lng: -77.0500 },
    'La Molina': { lat: -12.0833, lng: -76.9333 },
    'La Victoria': { lat: -12.0667, lng: -77.0167 },
    'Lima': { lat: -12.0464, lng: -77.0428 },
    'Lince': { lat: -12.0833, lng: -77.0333 },
    'Los Olivos': { lat: -11.9876, lng: -77.0682 },
    'Lurigancho': { lat: -11.9667, lng: -76.8667 },
    'Lurín': { lat: -12.2833, lng: -76.8667 },
    'Magdalena del Mar': { lat: -12.1000, lng: -77.0667 },
    'Miraflores': { lat: -12.1224, lng: -77.0302 },
    'Pachacámac': { lat: -12.2333, lng: -76.8500 },
    'Pucusana': { lat: -12.4833, lng: -76.8000 },
    'Pueblo Libre': { lat: -12.0667, lng: -77.0667 },
    'Puente Piedra': { lat: -11.8500, lng: -77.0833 },
    'Punta Hermosa': { lat: -12.3333, lng: -76.8167 },
    'Punta Negra': { lat: -12.3667, lng: -76.8000 },
    'Rímac': { lat: -12.0333, lng: -77.0333 },
    'San Bartolo': { lat: -12.3833, lng: -76.7833 },
    'San Borja': { lat: -12.1000, lng: -77.0000 },
    'San Isidro': { lat: -12.1000, lng: -77.0333 },
    'San Juan de Lurigancho': { lat: -12.0167, lng: -76.9667 },
    'San Juan de Miraflores': { lat: -12.1693, lng: -76.9712 },
    'San Luis': { lat: -12.0833, lng: -77.0000 },
    'San Martín de Porres': { lat: -12.0167, lng: -77.0833 },
    'San Miguel': { lat: -12.0833, lng: -77.0833 },
    'Santa Anita': { lat: -12.0500, lng: -76.9667 },
    'Santa María del Mar': { lat: -12.4333, lng: -76.7833 },
    'Santa Rosa': { lat: -11.8000, lng: -77.1667 },
    'Santiago de Surco': { lat: -12.1363, lng: -76.9979 },
    'Surquillo': { lat: -12.1167, lng: -77.0167 },
    'Villa El Salvador': { lat: -12.2167, lng: -76.9333 },
    'Villa María del Triunfo': { lat: -12.1667, lng: -76.9333 },

    // Arequipa
    'Arequipa': { lat: -16.3988, lng: -71.5369 },
    'Alto Selva Alegre': { lat: -16.3833, lng: -71.5333 },
    'Cayma': { lat: -16.4028, lng: -71.5275 },
    'Cerro Colorado': { lat: -16.3920, lng: -71.5733 },
    'Jacobo Hunter': { lat: -16.4167, lng: -71.5500 },
    'José Luis Bustamante y Rivero': { lat: -16.4167, lng: -71.5167 },
    'Mariano Melgar': { lat: -16.4000, lng: -71.5167 },
    'Paucarpata': { lat: -16.4333, lng: -71.5167 },
    'Sachaca': { lat: -16.4167, lng: -71.5833 },
    'Socabaya': { lat: -16.4500, lng: -71.5167 },
    'Tiabaya': { lat: -16.4667, lng: -71.5667 },
    'Yanahuara': { lat: -16.3889, lng: -71.5397 },

    // Cusco
    'Cusco': { lat: -13.5171, lng: -71.9788 },
    'San Blas': { lat: -13.5161, lng: -71.9788 },
    'Santiago': { lat: -13.5333, lng: -71.9833 },
    'Wanchaq': { lat: -13.5333, lng: -71.9500 },
    'San Sebastián': { lat: -13.5333, lng: -71.9333 },
    'San Jerónimo': { lat: -13.5500, lng: -71.8833 },

    // Trujillo (La Libertad)
    'Trujillo': { lat: -8.1091, lng: -79.0215 },
    'La Esperanza': { lat: -8.0854, lng: -79.0315 },
    'Victor Larco': { lat: -8.1320, lng: -79.0400 },
    'El Porvenir': { lat: -8.0833, lng: -79.0500 },
    'Florencia de Mora': { lat: -8.0833, lng: -79.0333 },
    'Huanchaco': { lat: -8.0833, lng: -79.1167 },
    'Laredo': { lat: -8.0833, lng: -78.9667 },
    'Moche': { lat: -8.1667, lng: -79.0167 },
    'Salaverry': { lat: -8.2167, lng: -78.9833 },

    // Piura
    'Piura': { lat: -5.1945, lng: -80.6328 },
    'Castilla': { lat: -5.1709, lng: -80.6660 },
    'Catacaos': { lat: -5.2667, lng: -80.6833 },
    'Cura Mori': { lat: -5.4333, lng: -80.7167 },
    'El Tallán': { lat: -5.4667, lng: -80.7333 },
    'La Arena': { lat: -5.3833, lng: -80.7500 },
    'La Unión': { lat: -5.4000, lng: -80.7500 },
    'Las Lomas': { lat: -4.6500, lng: -80.2500 },
    'Tambo Grande': { lat: -4.9333, lng: -80.3500 },

    // Lambayeque
    'Chiclayo': { lat: -6.7730, lng: -79.8411 },
    'José Leonardo Ortiz': { lat: -6.7749, lng: -79.8411 },
    'Pimentel': { lat: -6.8373, lng: -79.9342 },
    'Pomalca': { lat: -6.7667, lng: -79.8000 },
    'Pucalá': { lat: -6.7833, lng: -79.6167 },

    // Callao
    'Callao': { lat: -12.0333, lng: -77.1333 },
    'Bellavista': { lat: -12.0667, lng: -77.1167 },
    'Carmen de la Legua': { lat: -12.0500, lng: -77.0833 },
    'La Perla': { lat: -12.0667, lng: -77.1333 },
    'La Punta': { lat: -12.0667, lng: -77.1667 },
    'Ventanilla': { lat: -11.8833, lng: -77.1333 },
    'Mi Perú': { lat: -11.8500, lng: -77.1167 },

    // Ica
    'Ica': { lat: -14.0667, lng: -75.7333 },
    'La Tinguiña': { lat: -14.0833, lng: -75.7167 },
    'Los Aquijes': { lat: -14.1000, lng: -75.7000 },
    'Pueblo Nuevo': { lat: -14.1167, lng: -75.7000 },
    'Salas': { lat: -14.0833, lng: -75.7667 },
    'San José de los Molinos': { lat: -14.1667, lng: -75.6667 },
    'San Juan Bautista': { lat: -14.0167, lng: -75.7333 },
    'Subtanjalla': { lat: -14.0167, lng: -75.7667 },
    'Tate': { lat: -14.0500, lng: -75.6833 },
    'Yauca del Rosario': { lat: -14.1333, lng: -75.6833 },

    // Huancayo (Junín)
    'Huancayo': { lat: -12.0667, lng: -75.2333 },
    'Chilca': { lat: -12.0667, lng: -75.2167 },
    'El Tambo': { lat: -12.0667, lng: -75.2000 },
    'Pilcomayo': { lat: -12.0500, lng: -75.2333 },

    // Tacna
    'Tacna': { lat: -18.0056, lng: -70.2483 },
    'Alto de la Alianza': { lat: -18.0167, lng: -70.2500 },
    'Ciudad Nueva': { lat: -18.0000, lng: -70.2333 },
    'Coronel Gregorio Albarracín': { lat: -18.0333, lng: -70.2500 },
    'Pocollay': { lat: -18.0500, lng: -70.2000 },

    // Puno
    'Puno': { lat: -15.8433, lng: -70.0236 },
    'Acora': { lat: -15.9667, lng: -69.8333 },
    'Atuncolla': { lat: -15.6833, lng: -70.1333 },
    'Capachica': { lat: -15.6333, lng: -69.8333 },
    'Chucuito': { lat: -15.9000, lng: -69.8833 },
    'Coata': { lat: -15.5667, lng: -69.9333 },
    'Huata': { lat: -15.6167, lng: -70.0667 },
    'Mañazo': { lat: -15.5833, lng: -70.1167 },
    'Paucarcolla': { lat: -15.7333, lng: -70.0333 },
    'Pichacani': { lat: -16.1667, lng: -69.8333 },
    'Plateria': { lat: -15.9333, lng: -69.8333 },
    'San Antonio': { lat: -15.8000, lng: -70.0167 },
    'Tiquillaca': { lat: -15.7833, lng: -70.1833 },
    'Vilque': { lat: -15.7333, lng: -70.2333 }
  };

  generateRandomCoordinatesInDistrict(district: string): { lat: number, lng: number } {
    const baseCoords = this.districtCoordinates[district] || { lat: -12.0464, lng: -77.0428 };

    const randomOffset = () => (Math.random() - 0.5) * 0.02;

    return {
      lat: baseCoords.lat + randomOffset(),
      lng: baseCoords.lng + randomOffset()
    };
  }


}
