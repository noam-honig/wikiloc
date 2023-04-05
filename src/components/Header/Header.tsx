import "./header.scss";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Link
      to="/wikiloc/"
      className="header"
    >
      <h2>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Wikipedia_Logo_Puzzle_Globe_Spins_Horizontally%2C_Revealing_The_Contents_Of_All_Of_Its_Puzzle_Pieces_Without_Background.gif"
          alt="wikipedia"
        />
        ויקיפדיה סביבי
      </h2>
    </Link>
  );
}

export default Header;
