
import SideBar from "../../features/dashboard/components/SideBar/SideBar";
import { sidebarConfig } from "../../constants/appConfig/sidebarConfig/sidebarConfig";
import MainAdminDashboard from "../../features/dashboard/components/MainAdminDashboard/MainAdminDashboard";
import BackToTop from "../../shared/components/BackToTop/BackToTop";
// import ManageBlogs from "../../features/dashboard/components/ManageBlogs/ManageBlogs";

const AdminDashboard = () => {
  return (
    <>
      <SideBar sidebarConfig={sidebarConfig?.dashboardSidebar} />
      <MainAdminDashboard />
      <BackToTop />
      {/* <ManageBlogs /> */}
    </>
  );
};

export default AdminDashboard;
