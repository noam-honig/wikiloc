import React from "react";
import AddEnglishResultsButton from "../components/AddEnglishResultsButton/AddEnglishResultsButton";
import ArrowUp from "../components/ArrowUp/ArrowUp";
import Footer from "../components/Footer/Footer";
import "./pageLayout.css";

type Props = {
  children: JSX.Element;
};

function PageLayout({ children }: Props) {
  return (
    <div className="container">
      <h2 id="top-header">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Wikipedia_Logo_Puzzle_Globe_Spins_Horizontally%2C_Revealing_The_Contents_Of_All_Of_Its_Puzzle_Pieces_Without_Background.gif"
          alt="wikipedia"
        />
        ויקיפדיה סביבי
      </h2>
      {children}
      <AddEnglishResultsButton />
      <ArrowUp />
      <Footer />
    </div>
  );
}

export default PageLayout;
