import { useContext } from "react";
import { FaSearchPlus } from "react-icons/fa";
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
          <div>עוד תוצאות</div>
          <FaSearchPlus size={25} />
        </button>
      )}
    </>
  );
}

export default AddMoreResultsButton;
