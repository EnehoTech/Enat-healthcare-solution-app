import  { useEffect, useState } from 'react'
import styles from './DashboardTitle.module.css';

const DashboardTitle = ({
  title,
  subtitle,
  border,
  button,
  uniqueStyle,
  customSubtitleClass,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  // Handle screen resize and update `isMobile` state
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 992);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      className={`${styles["dashboard-title-wrapper"]} ${
        border ? border : ""
      } ${uniqueStyle ? uniqueStyle : ""} `}
    >
      {isMobile ? (
        <h1 className={` ${styles["dashboard-title"]}`}>{title}</h1>
      ) : (
        <>
          <h1 className={` ${styles["dashboard-title"]}`}>{title}</h1>
          {subtitle && (
            <p
              className={`${styles["dashboard-subtitle"]} ${styles[customSubtitleClass]}`}
            >
              {subtitle}
            </p>
          )}
        </>
      )}
      {button && (
        <div className={`ms-auto ${styles["dashboard-title-btn"]}`}>
          {button}
        </div>
      )}
    </div>
  );
};

export default DashboardTitle