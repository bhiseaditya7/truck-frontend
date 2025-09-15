import React from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { LatLngExpression } from "leaflet";

interface MapDisplayProps {
  geometry: { type: string; coordinates: [number, number][] };
}

export default function MapDisplay({ geometry }: MapDisplayProps) {
  console.log("Geometry received:", geometry);
  if (!geometry) return null;

  const coords = geometry.coordinates.map((c) => [c[1], c[0]]) as LatLngExpression[];
  console.log("Transformed coordinates:", coords);

  const center = coords[Math.floor(coords.length / 2)] as LatLngExpression;

  return (
    <div style={{ height: "400px", width: "100%" }}> {/* 👈 Constrain size here */}
      <MapContainer 
        center={center}
        zoom={6}
        style={{ height: "100%", width: "200%" }} // 👈 Fill the parent container
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline pathOptions={{ color: "blue", weight: 3 }} positions={coords} />
      </MapContainer>
    </div>
  );
}
