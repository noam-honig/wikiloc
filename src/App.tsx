import { useEffect, useState } from "react";
import { Geosearch, LatLngLocation, Result } from "./utils/types";

import {
  addDataToResult,
  getFetchURL,
  getWikipediaInfo,
  getWikipediaResults,
} from "./utils/utils";
import locIcon from "./assets/location.svg";
import SourceIcon from "./components/SourceIcon/SourceIcon";
import ResultEntry from "./components/ResultEntry/ResultEntry";
import Map from "./components/Map/Map";

import ArrowUp from "./components/ArrowUp/ArrowUp";

const App = () => {
  const [location, setLocation] = useState<LatLngLocation>();
  const [locationError, setLocationError] = useState<string>();
  const [results, setResults] = useState<Geosearch[]>([]);
  const [showAddEnglish, setShowAddEnglish] = useState(true);
  const [showMapView, setShowMapView] = useState(false);
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    const search = window.location.search;
    if (search.startsWith("?")) {
      const s = decodeURI(search.substring(1)).split(",");
      if (s.length == 2) {
        setLocation({ lat: +s[0], lng: +s[1] });
        return;
      }
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position?.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        setLocationError("Location Error: " + error?.message);
      }
    );
  }, []);
  useEffect(() => {
    if (location && !locationError) {
      setResults([]);
      getWikipediaResults(location, setResults);
    }
  }, [location]);
  const revealPage = () => setShowPage((prevState) => !prevState);
  return (
    <>
      {showPage ? (
        <>
          <div>
            {!locationError ? (
              <>
                {showMapView && <Map results={results} location={location!} />}

                {!showMapView &&
                  results.map((result) => (
                    <ResultEntry
                      key={result.pageid}
                      result={result}
                      location={location}
                    />
                  ))}
              </>
            ) : (
              <div>Unable to get location - {locationError}</div>
            )}

            <div
              style={{
                position: "sticky",
                gap: 3,
                bottom: 0,
                display: "flex",
                placeContent: "center",
                justifyContent: "space-around",
                zIndex: 9999,
              }}
            >
              {showAddEnglish && (
                <button
                  onClick={() => {
                    getWikipediaResults(location!, setResults, "en");
                    window.scrollTo(0, 0);
                    setShowAddEnglish(false);
                  }}
                >
                  הוסף ויקיפדיה באנגלית
                </button>
              )}
              <button
                onClick={() => {
                  setShowMapView((prev) => !prev);
                }}
              >
                {showMapView ? "רשימה" : "מפה"}
              </button>
              <ArrowUp fill="#646cff" />
            </div>
          </div>
        </>
      ) : (
        <>
          <article
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "48px 0",
              alignItems: "center",
              justifyContent: "space-evenly",
              height: "360px",
            }}
          >
            <div style={{ display: "flex" }}>
              <img
                src={locIcon}
                alt="icon-loc"
                style={{ width: "42px", marginLeft: "8px" }}
              />
              <h2 style={{ fontSize: "32px" }}>מאמרי ויקיפדיה סביבי</h2>
            </div>
            <p style={{ margin: "36px", lineHeight: 1.8 }}>
              מכירים את זה שאתם בחו"ל עומדים מול פסל ורוצים לקרוא עליו
              בויקיפדיה? או למצוא מה יש מעניין סביבי?
              <br /> לחצו על הכפתור הבא ותראו את כל מה שיש לויקיפדיה להציע בשני
              ק"מ הקרובים.
            </p>
            <button
              onClick={revealPage}
              style={{ textAlign: "center", backgroundColor: "#5624d0" }}
            >
              לחץ כדי לראות מה קורה סביבך
            </button>
          </article>
        </>
      )}
      <SourceIcon />
    </>
  );
};

export default App;
