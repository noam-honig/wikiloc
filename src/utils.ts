import {Geosearch, LatLngLocation} from "./App";

export const getEntriesFetchURL = (location: LatLngLocation) => {
	return `https://he.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${location.lat}|${location.lng}&gsradius=2000&gslimit=50&format=json&gsprop=type|name&inprop=url&prop=info&origin=*`
}

export const getEntriesInfoFetchURL = (entries: Geosearch[]) => {
	const idsStr = entries.map((t) => t.pageid).join("|");
	return `https://he.wikipedia.org/w/api.php?action=query&pageids=${idsStr}&format=json&prop=description&origin=*`
}