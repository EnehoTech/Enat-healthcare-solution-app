import SideBar from '../../components/SideBar/SideBar';
import { sidebarConfig } from '../../../../constants/appConfig/sidebarConfig/sidebarConfig';
import BackToTop from '../../../../shared/components/BackToTop/BackToTop';
import ManageDepartments from '../../components/ManageDepartments/ManageDepartments';

const DepartmentDashBoard = () => {
  return (
    <>
      <SideBar sidebarConfig={sidebarConfig?.dashboardSidebar} />
      <ManageDepartments />
      <BackToTop />
    </>
  );
}

export default DepartmentDashBoard