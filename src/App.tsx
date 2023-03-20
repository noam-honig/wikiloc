import { useEffect, useState } from "react";
import { Geosearch, LatLngLocation, Result } from "./utils/types";

import {
  addDataToResult,
  getFetchURL,
  getWikipediaInfo,
  getWikipediaResults,
} from "./utils/utils";

import SourceIcon from "./components/SourceIcon/SourceIcon";
import ResultEntry from "./components/ResultEntry/ResultEntry";

import ArrowUp from "./components/ArrowUp/ArrowUp";

const App = () => {
  const [location, setLocation] = useState<LatLngLocation>();
  const [locationError, setLocationError] = useState<string>();
  const [results, setResults] = useState<Geosearch[]>([]);
  const [showAddEnglish, setShowAddEnglish] = useState(true);
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
      },
    );
  }, []);
  useEffect(() => {
    if (location && !locationError) {
      setResults([]);
      getWikipediaResults(location, setResults);
    }
  }, [location]);

  return (
    <>
      <div>
        {!locationError ? (
          <>
            {results.map((result) => (
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
        {showAddEnglish && (
          <div
            style={{
              position: "sticky",
              bottom: 0,
              display: "flex",
              placeContent: "center",
              margin: "0 auto",
              width: "60%",
            }}
          >
            <button
              onClick={() => {
                getWikipediaResults(location!, setResults, "en");
                window.scrollTo(0, 0);
                setShowAddEnglish(false);
              }}
            >
              הוסף תוצאות מויקיפדיה באנגלית
            </button>
          </div>
        )}
        <SourceIcon />
      </div>
      <ArrowUp fill="#646cff" />
    </>
  );
};

export default App;
