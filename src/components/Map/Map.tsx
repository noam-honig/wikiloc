import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { Geosearch, LatLngLocation } from "../../utils/types";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import ResultEntry from "../ResultEntry/ResultEntry";

type MapViewProps = {
  results: Geosearch[];
  location: LatLngLocation;
};

const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [38, 38],
});

function MapView({ results, location }: MapViewProps) {
  if (location === undefined) return;

  return (
    <MapContainer
      style={{ height: "100vh", width: "100wh" }}
      center={[location.lng, location.lat]}
      zoom={13}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {results.map((result) => (
        <Marker position={[result.lon, result.lat]} icon={customIcon}>
          <Popup>
            <ResultEntry
              key={result.pageid}
              result={result}
              location={location}
            />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
