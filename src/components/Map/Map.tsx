import { useState, useEffect } from "react";
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

const lightTilesMap =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png";
const darkTilesMap =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png";

function Map({ results, location }: MapProps) {
  const [lightDark, setLightDark] = useState("light");
  useEffect(() => {
    // Check the initial user prefers-color-scheme
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setLightDark("light");
    } else {
      setLightDark("dark");
    }

    // Adding an event listener for changes in the prefers color scheme
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", (event) => {
        const mode = event.matches ? "light" : "dark";
        setLightDark(mode);
      });

    // Clean up function to remove the event listener when the component unmounted
    return () =>
      window
        .matchMedia("(prefers-color-scheme: light)")
        .removeEventListener("change", (event) => {
          const mode = event.matches ? "light" : "dark";
          setLightDark(mode);
        });
  }, []);

  if (location === undefined) return <></>;

  return (
    <MapContainer
      className="map-box"
      center={[location.lat, location.lng]}
      zoom={13}
    >
      <TileLayer
        url={lightDark === "light" ? lightTilesMap : darkTilesMap}
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
