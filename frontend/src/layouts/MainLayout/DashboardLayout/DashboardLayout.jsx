import { useState } from "react";
import { Outlet } from "react-router";
import styles from "./DashboardLayout.module.css";
import AdminHeader from "../../../features/dashboard/components/AdminHeader/AdminHeader";
import AdminFooter from "../../../features/dashboard/components/AdminFooter/AdminFooter";


const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSideBar = () => {
    setSidebarOpen((prev) => !prev);
  };
  return (
    <>
      <section
        className={`${styles["dashboard-layout"]} ${
          sidebarOpen ? " toggle-sidebar" : ""
        }`}
      >
        <AdminHeader onToggleSidebar={handleToggleSideBar} />
        <main className={styles["main-dashboard-content"]}>
          <Outlet />
        </main>
        <AdminFooter />
      </section>
    </>
  );
};

export default DashboardLayout;
