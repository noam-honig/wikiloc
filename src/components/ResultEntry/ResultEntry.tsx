import { FC } from "react";
import { Geosearch, LatLngLocation } from "../../utils/types";
import { direction, getGoogleMapLink, getResultLink } from "../../utils/utils";

import "./result-entry.scss";

type ResultEntryProps = {
  result: Geosearch;
  location: LatLngLocation | undefined;
};

const ResultEntry: FC<ResultEntryProps> = ({ result, location }) => {
  const style =
    result.wikiLang != "he" ? { direction: "ltr", width: "100%" } : undefined!;

  return (
    <div className={"NewResultEntry" + (result.mainImage ? " has-image" : "")}>
      <div>
        {result?.mainImage && (
          <a href={getResultLink(result)} target="_blank">
            <img
              src={result?.mainImage}
              alt={result?.mainImageAlt}
              className="ResultEntry--main__image"
            />
          </a>
        )}
        <div className="text-part">
          <div style={{ flexGrow: 1 }}>
            <a
              className={
                "ResultEntry--main__link" +
                (result.wikiLang !== "he" ? " NewResultEntry__ltr" : "")
              }
              href={getResultLink(result)}
              target="_blank"
            >
              {result?.title}
            </a>
            <div
              className={result.wikiLang !== "he" ? " NewResultEntry__ltr" : ""}
            >
              {result?.description}
            </div>
            {result.wikiLang !== "he" && (
              <div>
                <a
                  href={
                    "https://translate.google.com/translate?js=n&sl=en&tl=he&u=" +
                    getResultLink(result)
                  }
                  target="_blank"
                >
                  תרגום של גוגל
                </a>
              </div>
            )}
          </div>
          <a
            className="NewResultEntry--location-area"
            href={getGoogleMapLink(result)}
            target="_blank"
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
            <div className="ResultEntry--main__distance">
              {(result?.dist / 1000)?.toFixed(1)}{" "}
              <span className={"ResultEntry--main__distance--text"}>ק"מ</span>
            </div>
            <div style={{ fontSize: "small" }}>
              {direction(location, result)}
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResultEntry;
