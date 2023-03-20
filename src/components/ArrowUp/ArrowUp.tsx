import { useEffect, useState, SVGProps } from "react";
import "./ArrowUp.scss";

const ArrowUp = (props: SVGProps<SVGSVGElement>) => {
  // Go up the page after click the arrow up button
  const arrowUpClick = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const [scrolly, setScrolly] = useState(false);

  useEffect(() => {
    // Adjusting the arrow up button to appear after scolling 250px down the page
    const windowScrollY = () => {
      if (window.scrollY >= 250) {
        setScrolly(true);
      } else {
        setScrolly(false);
      }
    };

    window.addEventListener("scroll", windowScrollY);

    // clean up functions
    return () => {
      window.removeEventListener("scroll", windowScrollY);
    };
  }, []);
  return (
    <span
      className={scrolly ? "arrow-up show" : "arrow-up"}
      onClick={arrowUpClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12 12"
        {...props}
      >
        <path d="M3.646 5.902a.5.5 0 0 0 .708 0L5.5 4.756V8.5a.5.5 0 0 0 1 0V4.756l1.146 1.146a.5.5 0 1 0 .708-.707l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .707ZM6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1ZM2 6a4 4 0 1 1 8 0a4 4 0 0 1-8 0Z"></path>
      </svg>
    </span>
  );
};

export default ArrowUp;
