import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Coordinates, RouteSuggestion } from '../types';

// Fix for default marker icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const originIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd" fill="#16a34a" /></svg>'),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const destinationIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12 18a.75.75 0 0 1-.75-.75V11.25a.75.75 0 0 1 1.5 0v6a.75.75 0 0 1-.75.75Z" clip-rule="evenodd" fill="#dc2626" /><path d="M11.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" fill="#dc2626" /></svg>'),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

interface ChangeViewProps {
  center: L.LatLngExpression;
  zoom: number;
}

const ChangeView: React.FC<ChangeViewProps> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
};

interface MapViewProps {
  origin: Coordinates | null;
  destination: Coordinates | null;
  routes: RouteSuggestion[];
  selectedRouteIndex: number | null;
  onMapClick: (coords: Coordinates) => void;
}

const MapEvents: React.FC<{ onClick: (coords: Coordinates) => void }> = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const FitBounds: React.FC<{ bounds: L.LatLngBounds }> = ({ bounds }) => {
    const map = useMap();
    useEffect(() => {
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [map, bounds]);
    return null;
}

const MapView: React.FC<MapViewProps> = ({ origin, destination, routes, selectedRouteIndex, onMapClick }) => {
  const defaultCenter: L.LatLngExpression = [35.6895, 139.6917]; // Tokyo
  const bounds = (origin && destination) ? new L.LatLngBounds([origin.lat, origin.lng], [destination.lat, destination.lng]) : null;

  return (
    <MapContainer center={defaultCenter} zoom={10} scrollWheelZoom={true} className="z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {bounds ? <FitBounds bounds={bounds} /> : <ChangeView center={defaultCenter} zoom={10} />}
      <MapEvents onClick={onMapClick} />
      {origin && <Marker position={[origin.lat, origin.lng]} icon={originIcon}><Popup>出発地</Popup></Marker>}
      {destination && <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}><Popup>到着地</Popup></Marker>}
      
      {routes.map((route, index) => {
        const isSelected = index === selectedRouteIndex;
        return (
            <Polyline
            key={index}
            positions={route.path}
            pathOptions={{
                color: isSelected ? '#34d399' : '#0ea5e9',
                weight: isSelected ? 8 : 5,
                opacity: isSelected ? 1 : 0.7,
            }}
            />
        );
      })}
    </MapContainer>
  );
};

export default MapView;