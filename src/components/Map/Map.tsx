import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { Geosearch, LatLngLocation } from "../../utils/types";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import ResultEntry from "../ResultEntry/ResultEntry";
import MarkerClusterGroup from "react-leaflet-cluster";

import "./map.scss";

type MapProps = {
  results: Geosearch[];
  location: LatLngLocation;
};

const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/6276/6276532.png",
  iconSize: [38, 38],
});
const currentLocation = new Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/micons/green-dot.png",
  iconSize: [38, 38],
});

function Map({ results, location }: MapProps) {
  if (location === undefined) return <></>;

  return (
    <MapContainer
      className="map-box"
      center={[location.lat, location.lng]}
      zoom={13}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker
        position={[location.lat, location.lng]}
        icon={currentLocation}
      />
      {results.map((result) => (
        <Marker
          key={result.pageid}
          position={[result.lat, result.lon]}
          icon={customIcon}
        >
          <Popup>
            <div
              style={{
                minWidth: "300px",
                direction: "rtl",
                textAlign: "right",
              }}
            >
              <ResultEntry
                key={result.pageid}
                result={result}
                location={location}
              />
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
