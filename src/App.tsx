import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [location, setLocation] = useState<LatLngLocation>();
  const [locationError, setLocationError] = useState<string>();
  const [result, setResult] = useState<Geosearch[]>([]);
  useEffect(() => {
    const search = window.location.search;
    if (search.startsWith("?")) {
      let s = decodeURI(search.substring(1)).split(",");
      if (s.length == 2) {
        setLocation({ lat: +s[0], lng: +s[1] });
        return;
      }
    }
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        setLocationError("Location Error: " + error.message);
      }
    );
  }, []);
  useEffect(() => {
    if (location)
      fetch(
        `https://he.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${location.lat}|${location.lng}&gsradius=2000&gslimit=50&format=json&gsprop=type|name&inprop=url&prop=info&origin=*`,
        {}
      )
        .then((y) => y.json())
        .then((y: Result) => {
          setResult(y.query.geosearch);
          fetch(
            `https://he.wikipedia.org/w/api.php?action=query&pageids=${y.query.geosearch
              .map((t) => t.pageid)
              .join("|")}&format=json&prop=description|pageimages&origin=*`
          )
            .then((y) => y.json())
            .then((y) =>
              setResult((r) => {
                return r.map((r) => {
                  let mainImage: string = y.query.pages[
                    r.pageid
                  ]?.thumbnail?.source?.replace("50px", "300px");
                  if (mainImage.includes("no_free_image_yet"))
                    mainImage = undefined!;
                  return {
                    ...r,
                    description: y.query.pages[r.pageid]?.description,
                    mainImage,
                  };
                });
              })
            );
        });
  }, [location]);

  return (
    <div>
      <table>
        <tbody>
          {result.map((r) => {
            return (
              <tr key={r.pageid} className="entry">
                <td>
                  <a
                    style={{ fontSize: "x-large" }}
                    href={`https://he.m.wikipedia.org/w/index.php?curid=${r.pageid}`}
                    target="_blank"
                  >
                    {r.title}
                  </a>
                  <div>{r.description}</div>
                  <div>
                    {r.mainImage && (
                      <img
                        src={r.mainImage}
                        alt="main page image"
                        className="main-image"
                      />
                    )}
                  </div>
                </td>
                <td
                  style={{
                    alignItems: "middle",
                  }}
                >
                  <a
                    href={`https://maps.google.com/?q=${r.lat},${r.lon}`}
                    target="_blank"
                    style={{ width: "32px", height: "32px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </a>
                  <div style={{ whiteSpace: "nowrap" }}>
                    {(r.dist / 1000).toFixed(1)}{" "}
                    <span style={{ fontSize: "small" }}>ק"מ</span>
                  </div>
                  <div>{direction(location, r)}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        style={{ display: "flex", placeContent: "center", marginTop: "8px" }}
      >
        <a
          style={{ display: "flex", gap: "8px" }}
          href="https://www.github.com/noam-honig/wikiloc"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          קוד המקור
        </a>
      </div>
    </div>
  );
}

export default App;

export interface LatLngLocation {
  lat: number;
  lng: number;
}

export interface Result {
  batchcomplete: string;
  query: Query;
}

export interface Query {
  geosearch: Geosearch[];
}

export interface Geosearch {
  pageid: number;
  ns: number;
  title: string;
  lat: number;
  lon: number;
  dist: number;
  primary: string;
  type: Type | null;
  name: string;
  mainImage?: string;
  description?: string;
}

export enum Type {
  Landmark = "landmark",
}
function direction(location: LatLngLocation | undefined, r: Geosearch) {
  let degrees =
    (Math.atan2(location!.lng - r.lon, location!.lat - r.lat) * 180) / Math.PI +
    180;
  // Define array of directions
  let directions = [
    "צפון",
    "צפ-מז",
    "מזרח",
    "דר-מז",
    "דרום",
    "דר-מע",
    "מערב",
    "צפ-מע",
  ];

  // Split into the 8 directions
  degrees = (degrees * 8) / 360;

  // round to nearest integer.
  degrees = Math.round(degrees);

  // Ensure it's within 0-7
  degrees = (degrees + 8) % 8;
  return directions[degrees];
}
