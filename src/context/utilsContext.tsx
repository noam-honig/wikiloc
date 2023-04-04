import React, { useState, useEffect, createContext } from "react";
import { DIRECTIONS } from "../utils/constants";
import { Geosearch, LatLngLocation, Result } from "../utils/types";

type Props = {
  children: React.ReactNode;
};

export const UtilsContext = createContext<any>({});

const UtilsProvider: React.FunctionComponent<Props> = ({ children }) => {
  const [location, setLocation] = useState<LatLngLocation>();
  const [radius, setRadius] = useState(2000);
  const [locationError, setLocationError] = useState<string>();
  const [results, setResults] = useState<Geosearch[]>([]);
  const [language, setLanguage] = useState<string>("he");
  const [isShowingEnglish, setIsShowingEnglish] = useState<boolean>(true);
  const [isShowingMoreResults, setIsShowingMoreResults] =
    useState<boolean>(true);
  const [count, setCount] = useState<number>(0);

  const direction = (location: LatLngLocation | undefined, r: Geosearch) => {
    let degrees =
      (Math.atan2(location!.lng - r.lon, location!.lat - r.lat) * 180) /
        Math.PI +
      180;

    // Split into the 8 directions
    degrees = (degrees * 8) / 360;

    // round to nearest integer.
    degrees = Math.round(degrees);

    // Ensure it's within 0-7
    degrees = (degrees + 8) % 8;
    return DIRECTIONS?.[degrees];
  };

  const getFetchURL = (location: LatLngLocation, wikiLang: string): string => {
    return `https://${wikiLang}.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${location?.lat}|${location?.lng}&gsradius=${radius}&gslimit=50&format=json&gsprop=type|name&inprop=url&prop=info&origin=*`;
  };

  const addDataToResult = (results: Geosearch[], y: any, wikiLang: string) => {
    return results.map((result) => {
      if (result.wikiLang === wikiLang) {
        const mainImage: string = y?.query?.pages[
          result.pageid
        ]?.thumbnail?.source?.replace("50px", "500px");
        const mainImageAlt: string =
          y?.query?.pages[result.pageid]?.pageimage?.split(".")[0];
        return {
          ...result,
          description: y?.query?.pages[result?.pageid]?.description,
          mainImage: mainImage?.includes("no_free_image_yet")
            ? undefined
            : mainImage,
          mainImageAlt,
        };
      }
      return result;
    });
  };

  useEffect(() => {
    // If the user manually enter the coordinates by hand to the URL
    // Ex: http://localhost:5173/wikiloc/list/?68.153575,13.669497
    const search = window.location.search;
    if (search) {
      const latLong = search
        .replace("?", "")
        // In case the user entered a space after the comma
        .replace("%20", "")
        .split(",")
        .map((item) => parseFloat(item));
      console.log(latLong);
      setLocation({
        lat: latLong[0],
        lng: latLong[1],
      });
    } else {
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
    }
  }, []);

  useEffect(() => {
    if (location && !locationError) {
      getWikipediaResults(location, radius, language);
      if (language === "en") {
        setIsShowingEnglish(false);
      }
    }
  }, [location, language]);

  function getWikipediaResults(
    location: LatLngLocation,
    radius: number,
    wikiLang: string,
  ) {
    fetch(getFetchURL(location, (wikiLang = language)), {})
      .then((y) => y?.json())
      .then((y: Result) => {
        setResults((orig) => {
          const r = [
            ...orig,
            ...y.query.geosearch
              .filter(
                (g) =>
                  !orig.find(
                    (o) => o.pageid == g.pageid && o.wikiLang == wikiLang,
                  ),
              )
              .map((g) => ({ ...g, wikiLang })),
          ];
          r.sort((a, b) => +a.dist - +b.dist);
          return r;
        });
        fetch(getWikipediaInfo(y, wikiLang))
          .then((y) => y.json())
          .then((y) =>
            setResults((result) => addDataToResult(result, y, wikiLang)),
          );
      });
  }

  const getWikipediaInfo = (y: Result, wikiLang: string): string => {
    return `https://${wikiLang}.wikipedia.org/w/api.php?action=query&pageids=${y?.query?.geosearch
      ?.map((t) => t?.pageid)
      ?.join("|")}&format=json&prop=description|pageimages&origin=*`;
  };

  const getResultLink = (result: Geosearch): string => {
    return `https://${result.wikiLang}.m.wikipedia.org/w/index.php?curid=${result?.pageid}`;
  };

  const getGoogleMapLink = (result: Geosearch) => {
    return `https://maps.google.com/?q=${result?.lat},${result?.lon}`;
  };

  const loadMoreResults = () => {
    // Maximum range of radius is 10000 with the wikipedia API
    if (radius >= 10000) {
      setIsShowingMoreResults(false);
      return;
    }

    // Get all Hebrew and English results within the same range
    setCount(count + 1);
    if (count % 2 === 0) {
      setRadius(radius + 2000);
    }

    if (language === "he") {
      getWikipediaResults(location!, radius, "en");
      setLanguage("en");
    } else {
      getWikipediaResults(location!, radius, "he");
      setLanguage("he");
    }
  };

  const value = {
    direction,
    getWikipediaResults,
    getResultLink,
    getGoogleMapLink,
    setLanguage,
    loadMoreResults,
    language,
    results,
    location,
    locationError,
    isShowingEnglish,
    isShowingMoreResults,
    setLocation,
  };

  return (
    <UtilsContext.Provider value={value}>{children}</UtilsContext.Provider>
  );
};

export default UtilsProvider;
