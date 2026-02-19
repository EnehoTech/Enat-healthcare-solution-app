import { Link } from "react-router"; // Import Link from react-router
import styles from "./NavTabs.module.css";

const NavTabs = ({ tabItems, activeTab, onTabClick }) => {
  return (
    <ul className={`d-flex flex-column flex-lg-row ${styles["nav-tabs"]}`}>
      {tabItems?.map((tabItem, index) => (
        <Link
          key={index}
          to={`/${tabItem.path}`}
          className={`${styles["nav-tab-item"]} ${
            activeTab === index ? styles["nav-tab-active"] : ""
          }`}
          onClick={() => onTabClick(index)}
          aria-label={tabItem?.label}
        >
          <li aria-label={tabItem?.label} className={styles["nav-tab-link"]}>
            {tabItem.label}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default NavTabs;
