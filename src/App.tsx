import { useEffect, useState } from "react";
import { Geosearch, LatLngLocation, Result } from "./utils/types";

import { addDataToResult, getFetchURL, getImagesUrl } from "./utils/utils";

import SourceIcon from "./components/SourceIcon/SourceIcon";
import ResultEntry from "./components/ResultEntry/ResultEntry";

const App = () => {
  const [location, setLocation] = useState<LatLngLocation>();
  const [locationError, setLocationError] = useState<string>();
  const [results, setResults] = useState<Geosearch[]>([]);
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
    if (location && !locationError)
      fetch(getFetchURL(location), {})
        .then((y) => y?.json())
        .then((y: Result) => {
          setResults(y.query.geosearch);
          fetch(getImagesUrl(y))
            .then((y) => y.json())
            .then((y) => setResults((result) => addDataToResult(result, y)));
        });
  }, [location]);

  return (
    <div>
      {!locationError ? (
        <table>
          <tbody>
            {results.map((result) => (
              <ResultEntry key={result.pageid} result={result} location={location} />
            ))}
          </tbody>
        </table>
      ) : (
        <div>Unable to get location - {locationError}</div>
      )}
      <SourceIcon />
    </div>
  );
};

export default App;
