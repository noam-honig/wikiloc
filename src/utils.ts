import {LatLngLocation} from "./App";

export const getFetchEntriesURL = (location: LatLngLocation) => {
	return `https://he.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${location.lat}|${location.lng}&gsradius=2000&gslimit=50&format=json&gsprop=type|name&inprop=url&prop=info&origin=*`
}