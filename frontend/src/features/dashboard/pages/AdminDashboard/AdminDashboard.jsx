import SideBar from "../../components/SideBar/SideBar";
import MainAdminDashboard from "../../components/MainAdminDashboard/MainAdminDashboard";
import { sidebarConfig } from "../../../../constants/appConfig/sidebarConfig/sidebarConfig";
import BackToTop from "../../../../shared/components/BackToTop/BackToTop";
const AdminDashboard = () => {
  return (
    <>
      <SideBar sidebarConfig={sidebarConfig?.dashboardSidebar} />
      <MainAdminDashboard />
      <BackToTop />
    </>
  );
};

export default AdminDashboard;
