import { useEffect, useState } from "react"

function App() {
  const [location, setLocation] = useState<any>()
  const [locationError, setLocationError] = useState<string>()
  useEffect(() => {
    let r = navigator.geolocation.watchPosition(
      function (position) {
        const {
          accuracy,
          altitude,
          altitudeAccuracy,
          heading,
          latitude,
          longitude,
          speed,
        } = position.coords
        setLocation({
          accuracy,
          altitude,
          altitudeAccuracy,
          heading,
          latitude,
          longitude,
          speed,
        })
      },
      (error) => {
        setLocationError("Location Error: " + error.message)
      }
    )
    return () => navigator.geolocation.clearWatch(r)
  }, [])

  return <div>{JSON.stringify(location, undefined, 2)}</div>
}

export default App

export interface LatLngLocation {
  lat: number
  lng: number
}
