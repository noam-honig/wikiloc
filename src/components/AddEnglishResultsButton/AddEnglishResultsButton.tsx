import { useContext } from "react";
import { UtilsContext } from "../../context/utilsContext";
import "./AddEnglishResultsButton.scss";

function AddEnglishResultsButton() {
  const { isShowingEnglish, setLanguage } = useContext(UtilsContext);

  return (
    <>
      {isShowingEnglish && (
        <button
          className="lang-btn"
          onClick={() => {
            setLanguage("en");
            window.scrollTo(0, 0);
          }}
        >
          להוסיף ויקיפדיה באנגלית
        </button>
      )}
    </>
  );
}

export default AddEnglishResultsButton;
