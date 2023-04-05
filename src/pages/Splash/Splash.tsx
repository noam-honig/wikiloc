import { useNavigate } from "react-router-dom";
import "./splash.css";

function Splash() {
  const navigate = useNavigate();

  return (
    <div className="splash-page">
      <p id="description">
        מכירים את זה שאתם בחו"ל, עומדים מול פסל ורוצים לקרוא עליו בויקיפדיה? או
        למצוא מה יש מעניין סביבכם?
        <br />
        לחצו על הכפתור הבא ותראו את כל מה שיש לויקיפדיה להציע בשני הק"מ הקרובים
      </p>
      <button
        style={{
          textAlign: "center",
          backgroundColor: "#535bf2",
          color: "white",
          marginBottom: "30px",
        }}
        onClick={() => navigate("/wikiloc/list")}
      >
        לחצו כדי לראות מה קורה סביבכם
      </button>
    </div>
  );
}

export default Splash;
