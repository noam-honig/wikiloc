import { useEffect, useState } from "react"
import "./App.css"

function App() {
  const [location, setLocation] = useState<LatLngLocation>()
  const [locationError, setLocationError] = useState<string>()
  const [result, setResult] = useState<Geosearch[]>([])
  useEffect(() => {
    console.log("effect")
    let r = navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude, longitude } = position.coords
        setLocation({
          lat: latitude,
          lng: longitude,
        })
        console.log("location")
        fetch(
          `https://he.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${latitude}|${longitude}&gsradius=2000&gslimit=50&format=json&gsprop=type|name&inprop=url&prop=info&origin=*`,
          {}
        )
          .then((y) => y.json())
          .then((y: Result) => {
            setResult(y.query.geosearch)
            fetch(
              `https://he.wikipedia.org/w/api.php?action=query&pageids=${y.query.geosearch
                .map((t) => t.pageid)
                .join("|")}&format=json&prop=description&origin=*`
            )
              .then((y) => y.json())
              .then((y) =>
                setResult((r) => {
                  return r.map((r) => ({
                    ...r,
                    description: y.query.pages[r.pageid]?.description,
                  }))
                })
              )
          })
      },
      (error) => {
        setLocationError("Location Error: " + error.message)
      }
    )
  }, [])

  return (
    <table>
      <tbody>
        {result.map((r) => {
          return (
            <tr key={r.pageid} className="entry">
              <td>
                <a
                  style={{ fontSize: "larger" }}
                  href={`https://he.m.wikipedia.org/w/index.php?curid=${r.pageid}`}
                  target="_blank"
                >
                  {r.title}
                </a>
                <div>{r.description}</div>
              </td>
              <td>
                <a
                  href={`https://maps.google.com/?q=${r.lat},${r.lon}`}
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </a>
                <div style={{ whiteSpace: "nowrap" }}>
                  {(r.dist / 1000).toFixed(1)}{" "}
                  <span style={{ fontSize: "small" }}>ק"מ</span>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default App

export interface LatLngLocation {
  lat: number
  lng: number
}

export interface Result {
  batchcomplete: string
  query: Query
}

export interface Query {
  geosearch: Geosearch[]
}

export interface Geosearch {
  pageid: number
  ns: number
  title: string
  lat: number
  lon: number
  dist: number
  primary: string
  type: Type | null
  name: string
  description?: string
}

export enum Type {
  Landmark = "landmark",
}
