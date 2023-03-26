import { useContext } from "react";
import { UtilsContext } from "../../context/utilsContext";
import { Geosearch } from "../../utils/types";

import ResultEntry from "../../components/ResultEntry/ResultEntry";
import Spinner from "../../components/Spinner/Spinner";
import AddEnglishResultsButton from "../../components/AddEnglishResultsButton/AddEnglishResultsButton";
import "./listPage.css";

function ListPage() {
  const { results, location, locationError } = useContext(UtilsContext);

  return (
    <div className="list-page">
      {results.length === 0 ? (
        <div className="list-page-spinner">
          <Spinner />
        </div>
      ) : !locationError ? (
        <>
          {results.map((result: Geosearch) => (
            <ResultEntry
              key={result.pageid}
              result={result}
              location={location}
            />
          ))}
          <AddEnglishResultsButton />
        </>
      ) : (
        <div>Unable to get location - {locationError}</div>
      )}
    </div>
  );
}

export default ListPage;
