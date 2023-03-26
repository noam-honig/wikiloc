import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FaRegListAlt, FaMapMarked } from "react-icons/fa";
import "./listMapBtn.scss";

function ListMapBtn() {
  const location = useLocation();
  const { pathname } = location;

  return pathname.includes("/map") ? (
    <Link
      to="/wikiloc/list"
      className="list-map-btn"
    >
      <FaRegListAlt
        style={{ transform: "scaleX(-1)" }}
        size={25}
        fill="#646cff"
      />
    </Link>
  ) : (
    <Link
      to="/wikiloc/map"
      className="list-map-btn"
    >
      <FaMapMarked
        size={25}
        fill="#646cff"
      />
    </Link>
  );
}

export default ListMapBtn;
