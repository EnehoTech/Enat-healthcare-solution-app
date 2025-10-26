import { Link } from "react-router";
import styles from "./SectionBanner.module.css";
const SectionBanner = ({ title, subtitle, sectionBannerBg }) => {
  return (
    <>
      <div
        className={`${styles["page-banner-section"]} ${styles["bg-image"]} ${styles[sectionBannerBg]}`}
      >
        <div className="container">
          <div className={`${styles["page-banner-content"]}`}>
            <h2>{title}</h2>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>{subtitle}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionBanner;
