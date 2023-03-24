import React, { MouseEventHandler } from "react";
import "./splash.css";
import { useNavigate } from "react-router-dom";

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
      <button onClick={() => navigate("/wikiloc/list")}>Click me</button>
    </div>
  );
}

export default Splash;
