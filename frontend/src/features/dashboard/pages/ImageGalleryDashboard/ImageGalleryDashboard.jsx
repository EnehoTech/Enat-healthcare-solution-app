import SideBar from "../../components/SideBar/SideBar";
import { sidebarConfig } from "../../../../constants/appConfig/sidebarConfig/sidebarConfig";
import ManageImages from '../../components/ManageImages/ManageImages';
import BackToTop from "../../../../shared/components/BackToTop/BackToTop";
const ImageGalleryDashboard = () => {
  return (
    <>
      <SideBar sidebarConfig={sidebarConfig?.dashboardSidebar} />
      <ManageImages />
      <BackToTop />
    </>
  );
}

export default ImageGalleryDashboard