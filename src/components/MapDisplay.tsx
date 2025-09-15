// import React from "react";
// import { MapContainer, TileLayer, Polyline } from "react-leaflet";
// import { LatLngExpression } from "leaflet";

// interface MapDisplayProps {
//   geometry: { type: string; coordinates: [number, number][] };
// }

// export default function MapDisplay({ geometry }: MapDisplayProps) {
//   console.log("Geometry received:", geometry);
//   if (!geometry) return null;

//   const coords = geometry.coordinates.map((c) => [c[1], c[0]]) as LatLngExpression[];
//   console.log("Transformed coordinates:", coords);

//   const center = coords[Math.floor(coords.length / 2)] as LatLngExpression;

//   return (
//     <div style={{ height: "400px", width: "100%" }}> {/* 👈 Constrain size here */}
//       <MapContainer 
//         center={center}
//         zoom={6}
//         style={{ height: "100%", width: "200%" }} // 👈 Fill the parent container
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         <Polyline pathOptions={{ color: "blue", weight: 3 }} positions={coords} />
//       </MapContainer>
//     </div>
//   );
// }


import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";

interface MapDisplayProps {
  geometry: { type: string; coordinates: [number, number][] };
  fuelStopsMiles?: number[];
  restStops?: { hour: number; type: string }[];
  totalMiles?: number;
}

export default function MapDisplay({ geometry, fuelStopsMiles = [], restStops = [], totalMiles = 0 }: MapDisplayProps) {
  if (!geometry) return null;

  // ✅ Convert GeoJSON coordinates [lon,lat] -> [lat,lon]
  const coords = geometry.coordinates.map((c) => [c[1], c[0]]) as LatLngExpression[];

  // ✅ Pick center for initial map view
  const center = coords[Math.floor(coords.length / 2)] as LatLngExpression;

  // Helper: find approximate index along route for given mile marker
  const findIndexForMile = (mile: number) => {
    if (!totalMiles || coords.length === 0) return 0;
    const ratio = mile / totalMiles;
    return Math.min(coords.length - 1, Math.floor(coords.length * ratio));
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: "100%", width: "100%" }} // ✅ Fixed width: fills container properly
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* ✅ Draw Route */}
        <Polyline pathOptions={{ color: "blue", weight: 3 }} positions={coords} />

        {/* ✅ Add Fuel Stop Markers */}
        {fuelStopsMiles.map((mile, idx) => {
          const pos = coords[findIndexForMile(mile)];
          return (
            <Marker key={`fuel-${idx}`} position={pos}>
              <Popup>⛽ Fuel Stop at {mile.toFixed(0)} miles</Popup>
            </Marker>
          );
        })}

        {/* ✅ Add Rest Stop Markers */}
        {restStops.map((stop, idx) => {
          const approxMile = (stop.hour / (restStops.length ? restStops[restStops.length - 1].hour : 1)) * totalMiles;
          const pos = coords[findIndexForMile(approxMile)];
          return (
            <Marker key={`rest-${idx}`} position={pos}>
              <Popup>🛑 {stop.type} (Hour {stop.hour})</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
