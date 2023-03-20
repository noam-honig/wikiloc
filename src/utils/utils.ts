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

export const getFetchURL = (location: LatLngLocation): string => {
  return `https://he.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${location?.lat}|${location?.lng}&gsradius=2000&gslimit=50&format=json&gsprop=type|name&inprop=url&prop=info&origin=*`;
};

export const addDataToResult = (results: Geosearch[], y: any) => {
  return results.map((result) => {
    const mainImage: string = y?.query?.pages[
      result.pageid
    ]?.thumbnail?.source?.replace("50px", "300px");
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
  });
};

export const getImagesUrl = (y: Result): string => {
  return `https://he.wikipedia.org/w/api.php?action=query&pageids=${y?.query?.geosearch
    ?.map((t) => t?.pageid)
    ?.join("|")}&format=json&prop=description|pageimages&origin=*`;
};

export const getResultLink = (result: Geosearch): string => {
  return `https://he.m.wikipedia.org/w/index.php?curid=${result?.pageid}`;
};

export const getGoogleMapLink = (result: Geosearch) => {
  return `https://maps.google.com/?q=${result?.lat},${result?.lon}`;
};
