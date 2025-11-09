import  { useEffect, useState } from "react";
import "./BackToTop.css";
import { IoIosArrowDropupCircle } from "react-icons/io";

const BackToTop = () => {
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY);
    });
    return () => {
      window.removeEventListener("scroll", () => {
        setScroll(window.scrollY);
      });
    };
  }, [scroll]);

  const handleBackToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <a
        onClick={handleBackToTop}
        className={`back-to-top d-flex align-items-center justify-content-center ${
          scroll > 100 ? "active" : ""
        }`}
      >
        <IoIosArrowDropupCircle className="back-to-top-icon" />
      </a>
    </>
  );
};

export default BackToTop;
