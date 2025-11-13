import { useEffect, useState } from "react";
import StoryBoard from "../../../../../../../../Enat-healthcare-solution-app/frontend/src/features/dashboard/components/StoryBoard/StoryBoard";
import { breadcrumbItems } from "../../../../constants/appConfig/breadcrumbItemsConfig/breadcrumbItems";
import { images } from "../../../../constants/AssetsContainer";
import Breadcrumb from "../../../../shared/components/Breadcrumb/Breadcrumb";
import DashboardTitle from "../DashboardTitle/DashboardTitle";
import MetricsCard from "../MetricsCard/MetricsCard";
import Reports from "../Reports/Reports";
const MainAdminDashboard = () => {
  const [cardData, setCardData] = useState([]);
  const appStatistics = [
    {
      id: 1,
      name: "Total Users",
      total: "24 +",
      percentage: null,
      is_active: true,
    },
    {
      id: 2,
      name: "Total Doctors",
      total: "12 +",
      percentage: 0.5,
      is_active: true,
    },
    {
      id: 3,
      name: "Total Nurses",
      total: "6 +",
      percentage: 0.25,
      is_active: true,
    },
    {
      id: 4,
      name: "Total Admin employees",
      total: "6 +",
      percentage: 0.25,
      is_active: true,
    },
  ];
   useEffect(() => {
     setCardData(appStatistics);
   }, []);
  return (
    <main id="main" className="main">
      <Breadcrumb items={breadcrumbItems?.dashboard?.dashboard} />
      <DashboardTitle
        title="Main Dashboard"
        subtitle="Enat health care main dashboard space."
        border="border"
      />
      <section className="dashboard dashboard-section">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              {cardData?.map((cardItem) => (
                <MetricsCard key={cardItem.id} cardItem={cardItem} />
              ))}
            </div>
            <div className="col-12">
              <Reports />
            </div>
          </div>
          <div className="col-lg-4">
            {" "}
            <StoryBoard
              title="We Always Strive for Your Health."
              subtitle={
                <>
                  Dedicated to promoting your well-being through compassionate
                  care, innovation, and a commitment to better health every day.
                </>
              }
              btnText="Explore More"
              btnPath="/blogs"
              bgImage={images.storyboardBannerBg}
            />{" "}
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainAdminDashboard;
