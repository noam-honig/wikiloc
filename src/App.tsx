import { useEffect, useState } from 'react';
import { Geosearch, LatLngLocation } from './utils/types';

import { getWikipediaResults, loadLocation } from './utils/utils';
import ResultEntry from './components/ResultEntry/ResultEntry';
import Map from './components/Map/Map';

import ArrowUp from './components/ArrowUp/ArrowUp';
import Spinner from './components/Spinner/Spinner';
import ErrorIndicator from './components/ErrorIndicator/ErrorIndicator';

import { useInView } from 'react-intersection-observer';

const MAX_CLICK_SEARCH_FOR_WIKIPEDIA_API = 8;

const App = () => {
  const [location, setLocation] = useState<LatLngLocation>();
  const [radius, setRadius] = useState(2000);
  const [clickCounter, setClickCounter] = useState(1);
  const [locationError, setLocationError] = useState<string>();
  const [fetchError, setFetchError] = useState<string>();
  const [results, setResults] = useState<Geosearch[]>();
  const [showMapView, setShowMapView] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [speaking, setSpeaking] = useState('');

  const { ref, inView } = useInView({
    threshold: 1,
  });

  const handleClick = () => {
    if (clickCounter >= MAX_CLICK_SEARCH_FOR_WIKIPEDIA_API) return;
    setClickCounter((prevClick) => prevClick + 1);
    let rad = radius;

    if (rad > 10000) rad = 10000;
    setRadius(rad * 2);

    getWikipediaResults(
      location!,
      setResults,
      rad,
      setFetchError,
      () => {},
      'en'
    );
  };

  useEffect(() => {
    if (inView && !showMapView) handleClick();
  }, [inView]);

  useEffect(() => {
    if (showMapView) window.scrollTo(0, 0);
  }, [showMapView]);

  useEffect(() => {
    if (location && !locationError) {
      setResults([]);
      getWikipediaResults(location, setResults, radius, setFetchError, () => {
        getWikipediaResults(
          location,
          setResults,
          10000,
          setFetchError,
          () => {},
          'en'
        );
      });
    }
  }, [location]);

  const revealPage = () => {
    setShowPage((prevState) => !prevState);
    document.getElementById('description')?.remove();
    const header = document.getElementById('top-header');

    if (header) {
      header.className = 'smaller-header';
    }

    const search = window.location.search;
    if (search.startsWith('?')) {
      const s = decodeURI(search.substring(1)).split(',');
      if (s.length == 2) {
        setLocation({ lat: +s[0], lng: +s[1] });
        return;
      }
    }
    loadLocation(setLocation, setLocationError);
  };
  return (
    <>
      {/* <textarea id="xyz"></textarea>
      <button
        onClick={() => {
          let text:string = (document.getElementById("xyz") as any)!.value!;
          let val = 'חב"ד 123'.replaceAll('"',String.fromCharCode(1524));
        //  text= val;
          alert( text.charCodeAt(2) + " -> " + val.charCodeAt(2));

          const s = new SpeechSynthesisUtterance(text);
          s.voice = window.speechSynthesis
            .getVoices()
            .find((v) => v.lang.startsWith("he"))!;
          window.speechSynthesis.speak(s);
          console.log(s.text);
        }}
      >
        test
      </button> */}
      {showPage ? (
        <>
          {fetchError ? (
            <ErrorIndicator message={fetchError} />
          ) : results === undefined ? (
            <Spinner />
          ) : (
            <div>
              {!locationError ? (
                <>
                  {showMapView && (
                    <Map
                      results={results}
                      location={location!}
                      speaking={speaking}
                      setSpeaking={setSpeaking}
                    />
                  )}

                  <div>
                    {!showMapView &&
                      results.map((result) => {
                        const key = result.pageid + result.wikiLang;
                        return (
                          <ResultEntry
                            key={key}
                            result={result}
                            location={location}
                            speaking={key === speaking}
                            iAmSpeaking={() => setSpeaking(key)}
                          />
                        );
                      })}
                    <div
                      ref={ref}
                      style={{
                        display: `${showMapView}?'none':'block'`,
                      }}
                    ></div>
                  </div>
                </>
              ) : (
                <div>Unable to get location - {locationError}</div>
              )}

              <div
                style={{
                  position: 'sticky',
                  gap: 3,
                  bottom: 0,
                  display: 'flex',
                  placeContent: 'center',
                  justifyContent: 'space-around',
                  zIndex: 9999,
                }}
              >
                {clickCounter < MAX_CLICK_SEARCH_FOR_WIKIPEDIA_API && (
                  <button onClick={handleClick}>עוד תוצאות</button>
                )}
                <button
                  onClick={() => {
                    setShowMapView((prev) => !prev);
                  }}
                >
                  {showMapView ? 'רשימה' : 'מפה'}
                </button>
                {!showMapView && <ArrowUp fill="#646cff" />}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', placeContent: 'center' }}>
          <button
            onClick={revealPage}
            style={{
              textAlign: 'center',
              backgroundColor: '#535bf2',
              color: 'white',
              marginBottom: '30px',
            }}
          >
            לחצו כדי לראות מה קורה סביבכם
          </button>
        </div>
      )}
    </>
  );
};

export default App;
