import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LatLngTuple, Icon, LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { centerMap } from "@/utils/utils";

interface MapProps {
  center?: LatLngTuple;
  zoom?: number;
  onChange?: (pos: LatLngTuple) => void;
  enableDragUpdates?: boolean;
}

const customIcon = new Icon({
  iconUrl: "/images/MapPin.png",
  iconSize: [30, 66],
  iconAnchor: [15, 66],
});

const iranBounds: LatLngBoundsExpression = [
  [24.396308, 44.031296],
  [39.781721, 63.333403],
];

const LocationMarker = ({ position, onChange, enableDragUpdates = false }: { position: LatLngTuple; onChange?: (pos: LatLngTuple) => void; enableDragUpdates?: boolean }) => {
  const [mapCenter, setMapCenter] = useState<LatLngTuple>(position);

  const map = useMapEvents({
    move() {
      if (!enableDragUpdates) return;
      const center = map.getCenter();
      setMapCenter([center.lat, center.lng]);
    },
    moveend() {
      // Only call onChange when drag ends
      if (!enableDragUpdates) return;
      const center = map.getCenter();
      const newPosition: LatLngTuple = [center.lat, center.lng];
      setMapCenter(newPosition);
      onChange?.(newPosition);
    },
  });

  useEffect(() => {
    setMapCenter(position);
  }, [position]);

  return <Marker position={mapCenter} icon={customIcon} />;
};

const MapInner = ({ center = centerMap, zoom = 13, onChange, enableDragUpdates = false }: MapProps) => {
  const handlePositionChange = (pos: LatLngTuple) => {
    onChange?.(pos);
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer center={center} zoom={zoom} minZoom={5.5} zoomControl={false} className="z-10 w-full h-full" maxBounds={iranBounds} maxBoundsViscosity={1.0}>
        <TileLayer url={`https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=${process.env.NEXT_PUBLIC_MAP_TOKEN}`} />
        <LocationMarker position={center} onChange={enableDragUpdates ? handlePositionChange : undefined} enableDragUpdates={enableDragUpdates} />
      </MapContainer>
    </div>
  );
};

export default MapInner;
