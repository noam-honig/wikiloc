import { useContext } from "react";
import { FaSearchPlus } from "react-icons/fa";
import { UtilsContext } from "../../context/utilsContext";
import "./AddMoreResultsButton.scss";

type Props = {
  width?: string;
};
function AddMoreResultsButton(props: Props) {
  const { loadMoreResults, isShowingMoreResults, count } =
    useContext(UtilsContext);
  const { width } = props;
  return (
    <>
      {isShowingMoreResults && (
        <button
          style={{ width: width }}
          className='more-btn'
          onClick={() => {
            loadMoreResults();
            window.scrollTo(0, 0);
          }}
        >
          <div>עוד תוצאות ({8 - count})</div>
          <FaSearchPlus size={25} />
        </button>
      )}
    </>
  );
}

export default AddMoreResultsButton;
