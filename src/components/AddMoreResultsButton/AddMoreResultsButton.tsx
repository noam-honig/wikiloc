import { useContext } from "react";
import { UtilsContext } from "../../context/utilsContext";
import "./AddMoreResultsButton.scss";

function AddMoreResultsButton() {
  const { loadMoreResults, isShowingMoreResults } = useContext(UtilsContext);

  return (
    <>
      {isShowingMoreResults && (
        <button
          className="more-btn"
          onClick={() => {
            loadMoreResults();
            window.scrollTo(0, 0);
          }}
        >
          עוד תוצאות
          <br />
          עברית ואנגלית
        </button>
      )}
    </>
  );
}

export default AddMoreResultsButton;
