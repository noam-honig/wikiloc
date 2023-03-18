import {useEffect, useState} from "react";
import {LatLngLocation} from "../App";

function useLocation(): { location?: LatLngLocation, error?: string } {
	const [location, setLocation] = useState<LatLngLocation>();
	const [error, setError] = useState<string>();
	
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const locParam = params.get("loc");
		
		if (locParam) {
			const [lat, lng] = locParam.split(",");
			if (lat && lng) {
				setLocation({lat: +lat, lng: +lng});
				return;
			}
		}
		
		navigator.geolocation.getCurrentPosition(
			({coords}) => {
				const {latitude, longitude} = coords;
				setLocation({
					lat: latitude,
					lng: longitude
				});
			},
			(error) => {
				setError("Location Error: " + error.message);
			}
		);
	}, [])
	
	return {location, error};
}

export default useLocation;