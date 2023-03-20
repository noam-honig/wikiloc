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
    <a
      className={scrolly ? "arrow-up show" : "arrow-up"}
      onClick={arrowUpClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </a>
  );
};

export default ArrowUp;
