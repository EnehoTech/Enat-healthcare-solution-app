import  { useState } from "react";
import SectionTitle from "../SectionTitle/SectionTitle";
import { useEffect } from "react";
import { getAllDepartmentsService } from "../../services/public.service";
import PreLoader from "../../shared/components/PreLoader/PreLoader";
import Alert from "../../shared/components/Alert/Alert";

const Department = () => {
  const [departmentData, setDepartmentData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);
  // Fetch all Departments
  useEffect(() => {
    fetchAllDepartments();
  }, []);

  const fetchAllDepartments = async () => {
    try {
      setIsLoading(true);
      setApiErrors(null);
      const response = await getAllDepartmentsService();
      if (response.success === true || response.success === "true") {
        setDepartmentData(response.data?.departments || []);
      }
    } catch (error) {
      setApiErrors(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {/* ================ Service section start ================= */}
      {isLoading ? (
        <PreLoader />
      ) : (
        <section className="department-section">
          <div className="container">
            {/* ======= section title start =======  */}
            <SectionTitle
              title="Enat Healthcare Departments"
              description="Departments at Enat Health Care Solutions."
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
            <div className="row">
              {departmentData?.map((dept) => (
                <div key={`dept-${dept.id}`} className="col-md-6 col-lg-4 mb-4">
                  <div className="single-department text-center text-lg-left ">
                    <span className="department-icon">
                      <i className="fa-solid fa-hospital-user"></i>
                    </span>
                    <h3 className="department-title">{dept.department_name}</h3>
                    <p className="department-subtitle">
                      {dept.department_description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="enat-health-feature">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-10 offset-md-1 col-lg-6 offset-lg-6 offset-xl-7 col-xl-5">
              <div className="enat-health-feature-content">
                <h4>
                  Nurturing Health
                  <br />
                  With Compassion
                  <br />
                  And Excellence
                </h4>
                <h6>
                  Your trusted partner for holistic family wellness and advanced
                  medical care in Addis Ababa.
                </h6>
                <p>
                  At Enat Health Care Solutions, we believe in treating every
                  patient with the care and dedication of a mother. From
                  maternal health and pediatrics to chronic disease management,
                  our specialized team is committed to delivering personalized,
                  high-quality healthcare to ensure the well-being of our
                  community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================ Service section end =================    */}
    </>
  );
};;

export default Department;
