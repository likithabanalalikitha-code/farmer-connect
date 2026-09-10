import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, Navigation, Route } from 'lucide-react';
import Card from '../common/Card';

const agentIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const MapViewport = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length > 1) map.fitBounds(points, { padding: [32, 32] });
  }, [map, points]);

  return null;
};

const readCoordinates = (location) => {
  if (!location || location.latitude === undefined || location.longitude === undefined) return null;
  return [Number(location.latitude), Number(location.longitude)];
};

const DeliveryMap = ({ order }) => {
  const [agentPosition, setAgentPosition] = useState(null);
  const [destination, setDestination] = useState(readCoordinates(order.shippingAddress?.location));
  const [route, setRoute] = useState([]);
  const [error, setError] = useState('');
  const destinationLabel = `${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.pincode || ''}`;

  useEffect(() => {
    let watchId;
    if (!navigator.geolocation) {
      setError('This browser does not provide live location.');
      return undefined;
    }

    watchId = navigator.geolocation.watchPosition(
      ({ coords }) => setAgentPosition([coords.latitude, coords.longitude]),
      () => setError('Allow location access to show your route from the current position.'),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (destination || !destinationLabel) return undefined;
    const controller = new AbortController();
    fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(destinationLabel)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    })
      .then((response) => response.json())
      .then((results) => {
        if (results[0]) setDestination([Number(results[0].lat), Number(results[0].lon)]);
        else setError('The delivery address could not be located on the map.');
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError('Unable to locate the delivery address.');
      });
    return () => controller.abort();
  }, [destination, destinationLabel]);

  useEffect(() => {
    if (!agentPosition || !destination) return undefined;
    const controller = new AbortController();
    const coordinates = `${agentPosition[1]},${agentPosition[0]};${destination[1]},${destination[0]}`;
    fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`, { signal: controller.signal })
      .then((response) => response.json())
      .then((result) => setRoute(result.routes?.[0]?.geometry?.coordinates?.map(([longitude, latitude]) => [latitude, longitude]) || []))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError('Unable to calculate a driving route.');
      });
    return () => controller.abort();
  }, [agentPosition, destination]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationLabel)}`;
  const points = [agentPosition, destination].filter(Boolean);

  return (
    <Card className="overflow-hidden border-forest-200 dark:border-forest-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-earth-100 p-4 dark:border-earth-800">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-earth-900 dark:text-white"><Route className="h-4 w-4 text-forest-600" /> Live delivery route</p>
          <p className="text-xs text-earth-500">Your location to {destinationLabel}</p>
        </div>
        <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-forest-600 px-3 py-2 text-xs font-semibold text-forest-700 hover:bg-forest-50 dark:text-forest-400 dark:hover:bg-earth-900">
          <Navigation className="h-3.5 w-3.5" /> Open turn-by-turn
        </a>
      </div>
      {points.length < 2 ? (
        <div className="flex min-h-48 items-center justify-center gap-2 p-6 text-center text-sm text-earth-500"><LocateFixed className="h-4 w-4" />{error || 'Waiting for your current location and the delivery address...'}</div>
      ) : (
        <MapContainer center={points[0]} zoom={13} scrollWheelZoom className="h-80 w-full">
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={agentPosition} icon={agentIcon}><Popup>Your current location</Popup></Marker>
          <Marker position={destination} icon={agentIcon}><Popup>Customer delivery location</Popup></Marker>
          {route.length > 0 && <Polyline positions={route} pathOptions={{ color: '#15803d', weight: 5 }} />}
          <MapViewport points={points} />
        </MapContainer>
      )}
      {error && <p className="px-4 py-3 text-xs text-amber-700 dark:text-amber-300">{error}</p>}
    </Card>
  );
};

export default DeliveryMap;