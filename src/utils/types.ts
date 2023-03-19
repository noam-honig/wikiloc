export type LatLngLocation = {
  lat: number;
  lng: number;
};

export type Result = {
  batchcomplete: string;
  query: Query;
};

export type Query = {
  geosearch: Geosearch[];
};

export type Geosearch = {
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
};

export enum Type {
  Landmark = "landmark",
}
