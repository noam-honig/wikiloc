import { DIRECTIONS } from "./constants";
import { Geosearch, LatLngLocation, Result } from "./types";

const TESTING = false;
export function loadLocation(
  setLocation: (loc: LatLngLocation) => void,
  setError: (error: string) => void
) {
  if (TESTING) {
    setLocation({
      lat: 1,
      lng: 1,
    });
    return;
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
      setError("Location Error: " + error?.message);
    }
  );
}
export async function getTextToSpeak(result: Geosearch): Promise<string> {
  if (TESTING) {
    return result.title;
  }
  let r = await fetch(
    `https://${result.wikiLang}.wikipedia.org/w/api.php?action=query&pageids=${result.pageid}&format=json&prop=description|pageimages&origin=*&prop=extracts`
  ).then((r) => r.json());
  let text = r.query.pages[result.pageid].extract;
  return text;
}
export const direction = (
  location: LatLngLocation | undefined,
  r: Geosearch
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
  radius: number,
  wikiLang: string
): string => {
  return `https://${wikiLang}.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${location?.lat}|${location?.lng}&gsradius=${radius}&gslimit=50&format=json&gsprop=type|name&inprop=url&prop=info&origin=*`;
};

export const addDataToResult = (
  results: Geosearch[],
  y: any,
  wikiLang: string
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

export async function getWikipediaResults(
  location: LatLngLocation,
  setResults: (
    reduce: (orig: Geosearch[] | undefined) => Geosearch[] | undefined
  ) => void,
  radius: number,
  setFetchError: React.Dispatch<React.SetStateAction<string | undefined>>,
  wikiLang = "he"
) {
  if (TESTING) {
    setResults(() => [
      {
        pageid: 1,
        title: "מטוס",
        wikiLang: "he",
        dist: 1,
        name: "test",
        lat: 1,
        lon: 1,
        ns: 1,
        primary: "1",
        type: null,
      },
      {
        pageid: 2,
        title: "דירה",
        wikiLang: "he",
        dist: 1,
        name: "test",
        lat: 1,
        lon: 1,
        ns: 1,
        primary: "1",
        type: null,
      },
      {
        pageid: 3,
        title: "boat",
        wikiLang: "en",
        dist: 1,
        name: "test",
        lat: 1,
        lon: 1,
        ns: 1,
        primary: "1",
        type: null,
      },
    ]);
    return;
  }

  try {
    const y = await fetch(getFetchURL(location, radius, wikiLang), {});
    const response: Result = await y.json();

    if (response.query.geosearch.length === 0)
      throw new Error("לא נמצאו תוצאות");

    setResults((orig) => {
      const r = [
        ...orig!,
        ...response.query.geosearch
          .filter(
            (g) =>
              !orig!.find((o) => o.pageid == g.pageid && o.wikiLang == wikiLang)
          )
          .map((g) => ({ ...g, wikiLang })),
      ];
      r.sort((a, b) => +a.dist - +b.dist);
      return r;
    });

    const wikiInfoResponse = await fetch(getWikipediaInfo(response, wikiLang));
    const wikiInfo = await wikiInfoResponse.json();
    setResults((result) => addDataToResult(result!, wikiInfo, wikiLang));
  } catch (error: any) {
    setFetchError(error.message || error);
  }
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
