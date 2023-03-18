import { useEffect, useState } from "react"

function App() {
  const [location, setLocation] = useState<LatLngLocation>()
  const [locationError, setLocationError] = useState<string>()
  useEffect(() => {
    let r = navigator.geolocation.watchPosition(
      function (position) {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        setLocationError("Location Error: " + error.message)
      }
    )
    return () => navigator.geolocation.clearWatch(r)
  }, [])

  return <div>{JSON.stringify(location)}</div>
}

export default App

export interface LatLngLocation {
  lat: number
  lng: number
}
