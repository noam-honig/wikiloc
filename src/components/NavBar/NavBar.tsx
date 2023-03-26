import React from "react";
import ArrowUp from "../ArrowUp/ArrowUp";
import ListMapBtn from "../ListMapBtn/ListMapBtn";
import "./navBar.scss";

function NavBar() {
  return (
    <div className="nav-bar">
      <ArrowUp />
      <ListMapBtn />
    </div>
  );
}

export default NavBar;
