import React from "react";
import ArrowUp from "../components/ArrowUp/ArrowUp";
import "./pageLayout.css";

type Props = {
  children: JSX.Element;
};

function PageLayout({ children }: Props) {
  return (
    <div className="container">
      <>
        {children}
        <ArrowUp />
      </>
    </div>
  );
}

export default PageLayout;
