import { breadcrumbItems } from "../../../../constants/appConfig/breadcrumbItemsConfig/breadcrumbItems";
import Breadcrumb from "../../../../shared/components/Breadcrumb/Breadcrumb";
import DashboardTitle from "../DashboardTitle/DashboardTitle";
const MainAdminDashboard = () => {
  return (
    <main id="main" className="main">
      <Breadcrumb items={breadcrumbItems?.dashboard?.dashboard} />

      <DashboardTitle
        title="Main Dashboard"
        subtitle="Enat health care main dashboard space."
        border="border"
      />
      {/* <DashBoard /> */}
    </main>
  );
}

export default MainAdminDashboard