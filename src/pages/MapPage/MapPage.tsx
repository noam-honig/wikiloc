import { useContext } from "react";
import { UtilsContext } from "../../context/utilsContext";
import Map from "../../components/Map/Map";

function MapPage() {
  const { results, location } = useContext(UtilsContext);
  return (
    <Map
      results={results}
      location={location!}
    />
  );
}

export default MapPage;
