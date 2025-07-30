
export interface ApplicationData {
  companyName: string;
  vehicleName: string;
  departureDateTime: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteSuggestion {
  routeName: string;
  description: string;
  estimatedTime: number;
  path: Coordinates[];
}