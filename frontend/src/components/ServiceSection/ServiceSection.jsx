import { useEffect, useState } from "react";
// shared components
import SectionTitle from "../SectionTitle/SectionTitle";
import Alert from "../../shared/components/Alert/Alert";
import PreLoader from "../../shared/components/PreLoader/PreLoader";
// utils
import handleError from "../../utils/handleError";

// API Services
import { getAllServicesService } from "../../services/public.service";

const ServiceSection = () => {
  // data state
  const [servicesData, setServicesData] = useState([]);
  // ui state
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);
  // State that hold services displayed
  const [displayedServicesCount, setDisplayedServicesCount] = useState(6);

  // Fetch all services
  useEffect(() => {
    fetchAllServices();
  }, []);

  const fetchAllServices = async () => {
    try {
      setIsLoading(true);
      setApiErrors(null);
      const response = await getAllServicesService();
      if (response.success === true) {
        setServicesData(response.data.services || []);
      }
    } catch (error) {
      setApiErrors(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  //   handle show More
  const handleShowMore = () => {
    setDisplayedServicesCount(servicesData.length); // Show all services
  };
  //   handle show Less
  const handleShowLess = () => {
    setDisplayedServicesCount(6); // Reset to showing only 9 services
  };
  return (
    <>
      {isLoading ? (
        <PreLoader />
      ) : (
        servicesData.length > 0 && (
          // ======= service section start =======
          <section id="services" className="services-section p-block-70">
            {/* ======= section title start =======  */}
            <SectionTitle
              title="Services"
              description="Holistic Services Offered By Enat Health Care Solutions."
            />
            {/* ======= section title end =======  */}

            {apiErrors && (
              <Alert
                message={apiErrors}
                alertBg="bg-red-25"
                alertClass="alert-danger"
                messageColor="text-danger"
              />
            )}

            <section className="service-container">
              {servicesData
                ?.slice(0, displayedServicesCount)
                ?.map((service, index) => (
                  <section key={`service-${index}`} className="service-item">
                    <section className="service-icon">
                      <i className={service?.icon_class_name}></i>
                    </section>
                    <a href="#" className="stretched-link">
                      <h3>{service?.service_title}</h3>
                    </a>
                    <p className="tag-line">{service?.service_subtitle}</p>
                    <p className="description">
                      {service?.service_description}
                    </p>
                  </section>
                ))}

            </section>
            <div className="d-flex justify-content-center xt-center mt-4 mb-1">
              {servicesData.length > 6 && (
                <>
                  {displayedServicesCount < servicesData.length ? (
                    <button className="main-btn" onClick={handleShowMore}>
                      Show More Services
                    </button>
                  ) : (
                    <button className="main-btn" onClick={handleShowLess}>
                      Show Less Services
                    </button>
                  )}
                </>
              )}
            </div>
          </section>
          //   ======= service section end =======
        )
      )}
    </>
  );
};

export default ServiceSection;
