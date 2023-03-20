import { DIRECTIONS } from "./constants";
import { Geosearch, LatLngLocation, Result } from "./types";

export const direction = (
  location: LatLngLocation | undefined,
  r: Geosearch,
) => {
  let degrees =
    (Math.atan2(location!.lng - r.lon, location!.lat - r.lat) * 180) / Math.PI +
    180;

  // Split into the 8 directions
  degrees = (degrees * 8) / 360;

  // round to nearest integer.
  degrees = Math.round(degrees);

  // Ensure it's within 0-7
  degrees = (degrees + 8) % 8;
  return DIRECTIONS?.[degrees];
};

export const getFetchURL = (
  location: LatLngLocation,
  wikiLang: string,
): string => {
  return `https://${wikiLang}.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${location?.lat}|${location?.lng}&gsradius=2000&gslimit=50&format=json&gsprop=type|name&inprop=url&prop=info&origin=*`;
};

export const addDataToResult = (
  results: Geosearch[],
  y: any,
  wikiLang: string,
) => {
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

export function getWikipediaResults(
  location: LatLngLocation,
  setResults: (reduce: (orig: Geosearch[]) => Geosearch[]) => void,
  wikiLang = "he",
) {
  fetch(getFetchURL(location, wikiLang), {})
    .then((y) => y?.json())
    .then((y: Result) => {
      setResults((orig) => {
        const r = [
          ...orig,
          ...y.query.geosearch.map((g) => ({ ...g, wikiLang })),
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

export const getWikipediaInfo = (y: Result, wikiLang: string): string => {
  return `https://${wikiLang}.wikipedia.org/w/api.php?action=query&pageids=${y?.query?.geosearch
    ?.map((t) => t?.pageid)
    ?.join("|")}&format=json&prop=description|pageimages&origin=*`;
};

export const getResultLink = (result: Geosearch): string => {
  return `https://${result.wikiLang}.m.wikipedia.org/w/index.php?curid=${result?.pageid}`;
};

export const getGoogleMapLink = (result: Geosearch) => {
  return `https://maps.google.com/?q=${result?.lat},${result?.lon}`;
};
