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
  const [language, setLanguage] = useState("he");
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    const languageCode = navigator.language.split("-")[0];
    if (/^[a-z]{2}$/i.test(languageCode)) {
      setLanguage(languageCode);
    } else {
      console.error("Filed to detect user language")
    }
  }, []);

  useEffect(() => {
    if (location && !locationError) {
      setResults([]);
      getWikipediaResults(location, setResults);
    }
  }, [location]);

  const revealPage = () => {
    setShowPage((prevState) => !prevState);
    document.getElementById("description")?.remove();
    const header = document.getElementById("top-header");

    if (header) {
      header.className = "smaller-header";
    }

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
      getWikipediaResults(location, setResults, language);
    }
  }, [location, language]);
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
              {!showMapView && <ArrowUp fill="#646cff" />}
            </div>
          </div>
        </>
      ) : (
        <div style={{ display: "flex", placeContent: "center" }}>
          <button
            onClick={revealPage}
            style={{
              textAlign: "center",
              backgroundColor: "#535bf2",
              color: "white",
              marginBottom: "30px",
            }}
          >
            לחץ/י כדי לראות מה קורה סביבך
          </button>
        </div>
      )}
     
      <SourceIcon />
    </>
  );
};

export default App;
