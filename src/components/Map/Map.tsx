import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { Geosearch, LatLngLocation } from "../../utils/types";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import ResultEntry from "../ResultEntry/ResultEntry";
import MarkerClusterGroup from "react-leaflet-cluster";

type MapProps = {
  results: Geosearch[];
  location: LatLngLocation;
  speaking: string;
  setSpeaking: (key: string) => void;
};

const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [38, 38],
});
const currentLocation = new Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/micons/green-dot.png",
  iconSize: [38, 38],
});

function Map({ results, location, speaking, setSpeaking }: MapProps) {
  if (location === undefined) return <></>;

  return (
    <MapContainer
      style={{ height: "100vh", width: "100wh" }}
      center={[location.lat, location.lng]}
      zoom={13}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={[location.lat, location.lng]} icon={currentLocation} />
      {results.map((result) => {
        const key = result.pageid + result.wikiLang;
        return (
          <Marker
            key={key}
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
                  key={key}
                  result={result}
                  location={location}
                  speaking={speaking == key}
                  iAmSpeaking={() => setSpeaking(key)}
                />
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default Map;
