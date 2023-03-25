import { useEffect, useState } from "react";
import { Geosearch, LatLngLocation } from "./utils/types";

// import { getWikipediaResults } from "./utils/utils";
import ResultEntry from "./components/ResultEntry/ResultEntry";
import Map from "./components/Map/Map";

import { Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash/Splash";
import ListPage from "./pages/ListPage/ListPage";
import MapPage from "./pages/MapPage/MapPage";
import NavBar from "./components/NavBar/NavBar";
import PageLayout from "./Layouts/PageLayout";

const App = () => {
  return (
    <>
      <PageLayout>
        <>
          {/* <NavBar /> */}
          <Routes>
            <Route
              path="wikiloc/"
              element={<Splash />}
            />
            <Route
              path="wikiloc/list"
              element={<ListPage />}
            />
            <Route
              path="wikiloc/map"
              element={<MapPage />}
            />
          </Routes>
        </>
      </PageLayout>
    </>
  );
};
export default App;

// const [location, setLocation] = useState<LatLngLocation>();
// const [locationError, setLocationError] = useState<string>();
// const [results, setResults] = useState<Geosearch[]>([]);
// const [showAddEnglish, setShowAddEnglish] = useState(true);
// const [showMapView, setShowMapView] = useState(false);
// const [showPage, setShowPage] = useState(false);
// useEffect(() => {
//   if (location && !locationError) {
//     setResults([]);
//     getWikipediaResults(location, setResults);
//   }
// }, [location]);
// const revealPage = () => {
//   setShowPage((prevState) => !prevState);
//   document.getElementById("description")?.remove();
//   const header = document.getElementById("top-header");
//   if (header) {
//     header.className = "smaller-header";
//   }
//   const search = window.location.search;
//   if (search.startsWith("?")) {
//     const s = decodeURI(search.substring(1)).split(",");
//     if (s.length == 2) {
//       setLocation({ lat: +s[0], lng: +s[1] });
//       return;
//     }
//   }
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const { latitude, longitude } = position?.coords;
//       setLocation({
//         lat: latitude,
//         lng: longitude,
//       });
//     },
//     (error) => {
//       setLocationError("Location Error: " + error?.message);
//     }
//   );
// };
// return (
//   <>
//     {showPage ? (
//       <>
//         <div>
//           {!locationError ? (
//             <>
//               {showMapView && <Map results={results} location={location!} />}
//               {!showMapView &&
//                 results.map((result) => (
//                   <ResultEntry
//                     key={result.pageid}
//                     result={result}
//                     location={location}
//                   />
//                 ))}
//             </>
//           ) : (
//             <div>Unable to get location - {locationError}</div>
//           )}
//           <div
//             style={{
//               position: "sticky",
//               gap: 3,
//               bottom: 0,
//               display: "flex",
//               placeContent: "center",
//               justifyContent: "space-around",
//               zIndex: 9999,
//             }}
//           >
//             {showAddEnglish && (
//               <button
//                 onClick={() => {
//                   getWikipediaResults(location!, setResults, "en");
//                   window.scrollTo(0, 0);
//                   setShowAddEnglish(false);
//                 }}
//               >
//                 להוסיף ויקיפדיה באנגלית
//               </button>
//             )}
//             <button
//               onClick={() => {
//                 setShowMapView((prev) => !prev);
//               }}
//             >
//               {showMapView ? "רשימה" : "מפה"}
//             </button>
//             {!showMapView && <ArrowUp fill="#646cff" />}
//           </div>
//         </div>
//       </>
//     ) : (
//       <div style={{ display: "flex", placeContent: "center" }}>
//         <button
//           onClick={revealPage}
//           style={{
//             textAlign: "center",
//             backgroundColor: "#535bf2",
//             color: "white",
//             marginBottom: "30px",
//           }}
//         >
//           לחץ/י כדי לראות מה קורה סביבך
//         </button>
//       </div>
//     )}
//   </>
// );
