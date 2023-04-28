import { useEffect, useState } from "react";
import { Geosearch, LatLngLocation } from "./utils/types";

import { getWikipediaResults } from "./utils/utils";
import ResultEntry from "./components/ResultEntry/ResultEntry";
import Map from "./components/Map/Map";

import ArrowUp from "./components/ArrowUp/ArrowUp";
import Spinner from "./components/Spinner/Spinner";
import ErrorIndicator from "./components/ErrorIndicator/ErrorIndicator";

const App = () => {
  const [location, setLocation] = useState<LatLngLocation>();
  const [radius, setRadius] = useState(2000);
  const [locationError, setLocationError] = useState<string>();
  const [fetchError, setFetchError] = useState<string>();
  const [results, setResults] = useState<Geosearch[]>([]);
  const [loadedEnglish, setLoadedEnglish] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    if (location && !locationError) {
      setResults([]);
      getWikipediaResults(location, setResults, radius, setFetchError);
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
  };
  return (
    <>
      {showPage ? (
        <>
          {fetchError ? (
            <ErrorIndicator message={fetchError} />
          ) : results.length === 0 ? (
            <Spinner />
          ) : (
            <div>
              {!locationError ? (
                <>
                  {showMapView && (
                    <Map results={results} location={location!} />
                  )}

                  {!showMapView &&
                    results.map((result) => (
                      <ResultEntry
                        key={result.pageid + result.wikiLang}
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
                {radius < 10000 && (
                  <button
                    onClick={() => {
                      let rad = radius;
                      if (!loadedEnglish) {
                        window.scrollTo(0, 0);
                        setLoadedEnglish(true);
                      } else {
                        rad *= 2;
                        if (rad > 10000) rad = 10000;
                        setRadius(rad);
                        getWikipediaResults(
                          location!,
                          setResults,
                          rad,
                          setFetchError
                        );
                      }
                      getWikipediaResults(
                        location!,
                        setResults,
                        rad,
                        setFetchError,
                        "en"
                      );
                    }}
                  >
                    עוד תוצאות
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
          )}
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
            לחצו כדי לראות מה קורה סביבכם
          </button>
        </div>
      )}
    </>
  );
};

export default App;
