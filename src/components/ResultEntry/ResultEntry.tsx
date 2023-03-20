import { FC } from "react";
import { Geosearch, LatLngLocation } from "../../utils/types";
import { direction, getGoogleMapLink, getResultLink } from "../../utils/utils";

import "./result-entry.scss";

type ResultEntryProps = {
  result: Geosearch;
  location: LatLngLocation | undefined;
};

const ResultEntry: FC<ResultEntryProps> = ({ result, location }) => {
  return (
    <tr className="ResultEntry--main">
      <td>
        <a
          className="ResultEntry--main__link"
          href={getResultLink(result)}
          target="_blank"
        >
          {result?.title}
        </a>
        <div>{result?.description}</div>
        <div>
          {result?.mainImage && (
            <img
              src={result?.mainImage}
              alt={result?.mainImageAlt}
              className="ResultEntry--main__image"
            />
          )}
        </div>
      </td>
      <td
        style={{
          alignItems: "middle",
        }}
      >
        <a
          href={getGoogleMapLink(result)}
          target="_blank"
          className={"ResultEntry--main__google-link"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
        </a>
        <div className="ResultEntry--main__distance">
          {(result?.dist / 1000)?.toFixed(1)}{" "}
          <span className={"ResultEntry--main__distance--text"}>ק"מ</span>
        </div>
        <div style={{ fontSize: "small" }}>{direction(location, result)}</div>
      </td>
    </tr>
  );
};

export default ResultEntry;
