import { FC, useEffect, useState } from "react";
import { Geosearch, LatLngLocation } from "../../utils/types";
import {
  direction,
  getGoogleMapLink,
  getResultLink,
  getTextToSpeak,
} from "../../utils/utils";

import "./result-entry.scss";

type ResultEntryProps = {
  result: Geosearch;
  location: LatLngLocation | undefined;
  speaking: boolean;
  iAmSpeaking: () => void;
};

const ResultEntry: FC<ResultEntryProps> = ({
  result,
  location,
  speaking,
  iAmSpeaking,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [textsToRead, setTextsToRead] = useState<string[]>();
  const [speechIndex, setSpeechIndex] = useState(0);

  function findVoice() {
    return window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith(result.wikiLang))!;
  }

  useEffect(() => {
    if (findVoice() || true) {
      getTextToSpeak(result).then((text) => {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = text;
        text = tmp.textContent || tmp.innerText || "";

        const split = text.split(/[.\n]/).filter((x) => x.trim());

        setTextsToRead(split);
      });
    }
  }, []);
  function readIt() {
    try {
      console.log(textsToRead!);
      let speech = window.speechSynthesis;
      if (speaking) {
        if (playing) speech.pause();
        else speech.resume();
        setPlaying(!playing);

        return;
      }

      speech.cancel();

      let i = 0;

      function speak() {
        if (i >= textsToRead!.length) return;
        let text = textsToRead![i++];
        setSpeechIndex(i);
        let s = new SpeechSynthesisUtterance(text);
        s.voice = findVoice();

        s.addEventListener("end", () => {
          speak();
        });
        s.addEventListener("error", (err) => console.log(err));

        speech.speak(s);
        iAmSpeaking();
      }
      speak();
    } catch (err) {
      alert("catch:" + err);
    }
  }
  return (
    <div className={"NewResultEntry" + (imageLoaded ? " has-image" : "")}>
      <div>
        {result?.mainImage && (
          <a href={getResultLink(result)} target="_blank">
            <img
              onLoad={() => setImageLoaded(true)}
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
            {textsToRead && (
              <span onClick={readIt}>
                {speaking ? (playing ? `${speechIndex} / ${textsToRead.length} - ⏸️` : "▶️") : "🔊"}
              </span>
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
