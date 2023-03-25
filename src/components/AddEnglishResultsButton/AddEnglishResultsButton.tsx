import { useState, useContext } from "react";
import { UtilsContext } from "../../context/utilsContext";

function AddEnglishResultsButton() {
  const { setLanguage } = useContext(UtilsContext);
  const [isShowing, setIsShowing] = useState<boolean>(true);
  return (
    <>
      {isShowing && (
        <button
          onClick={() => {
            setLanguage("en");
            setIsShowing(false);
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
