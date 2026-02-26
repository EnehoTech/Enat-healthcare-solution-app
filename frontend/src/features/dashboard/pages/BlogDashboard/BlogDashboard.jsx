import SideBar from "../../components/SideBar/SideBar";
import { sidebarConfig } from "../../../../constants/appConfig/sidebarConfig/sidebarConfig";
import ManageBlogs from "../../components/ManageBlogs/ManageBlogs";
import BackToTop from "../../../../shared/components/BackToTop/BackToTop";

const BlogDashboard = () => {
  return (
    <>
      <SideBar sidebarConfig={sidebarConfig?.dashboardSidebar} />
      <ManageBlogs />
      <BackToTop />
    </>
  );
};

export default BlogDashboard;
