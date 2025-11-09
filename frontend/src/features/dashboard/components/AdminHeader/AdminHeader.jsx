import React from "react";
import styles from "./AdminHeader.module.css";
import AdminNav from "../AdminNav/AdminNav";
import { images } from "../../../../constants/AssetsContainer";
import { Link } from "react-router";
import { MdOutlineMenu } from "react-icons/md";

const AdminHeader = ({ onToggleSidebar }) => {
  // const handleToggleSideBar = () => {
  //   document.body.classList.toggle("toggle-sidebar");
  // };
  return (
    <header
      id="admin-header"
      className={`${styles["admin-header"]} fixed-top d-flex align-items-center`}
    >
      {/* admin header logo */}
      <div className="d-flex align-items-center justify-content-between">
        <div className={`${styles["logo-wrapper"]}`}>
          <div className={`${styles["logo"]}`}>
            <Link to="/" className="d-flex align-items-center">
              <img
                className="d-block d-sm-none"
                src={images.enatLogoSM}
                alt="admin-logo-sm"
              />

              <img
                className="d-none d-sm-block"
                src={images.enatLogo}
                alt="enat-health-care-solutions-logo"
              />
            </Link>
          </div>
        </div>
        <div>
          <MdOutlineMenu
            className={`${styles["toggle-sidebar-btn"]}`}
            onClick={onToggleSidebar}
          />
        </div>
      </div>

      {/* admin nav links */}
      <AdminNav />
    </header>
  );
};

export default AdminHeader;
