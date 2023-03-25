import { useContext } from "react";
import { UtilsContext } from "../../context/utilsContext";

function AddEnglishResultsButton() {
  const { setLanguage } = useContext(UtilsContext);
  return (
    <button
      onClick={() => {
        setLanguage("en");
        window.scrollTo(0, 0);
        // setShowAddEnglish(false);
      }}
    >
      להוסיף ויקיפדיה באנגלית
    </button>
  );
}

export default AddEnglishResultsButton;
