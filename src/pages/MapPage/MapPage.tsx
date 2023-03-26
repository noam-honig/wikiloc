import { useContext } from "react";
import { UtilsContext } from "../../context/utilsContext";
import Map from "../../components/Map/Map";

function MapPage() {
  const { results, location } = useContext(UtilsContext);
  return (
    <div style={{ flex: 1 }}>
      <Map
        results={results}
        location={location!}
      />
    </div>
  );
}

export default MapPage;
