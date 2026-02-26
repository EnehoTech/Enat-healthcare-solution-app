import { useRef, useState } from "react";
import styles from "../../styles/CommonDashboard.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import StoryBoard from "../StoryBoard/StoryBoard";
import { images } from "../../../../constants/AssetsContainer";
import Breadcrumb from "../../../../shared/components/Breadcrumb/Breadcrumb";
import { breadcrumbItems } from "../../../../constants/appConfig/breadcrumbItemsConfig/breadcrumbItems";
import DashboardTitle from "../DashboardTitle/DashboardTitle";
import NavTabs from "../../../../shared/components/NavTabs/NavTabs";
import { navTabItems } from "../../../../constants/appConfig/navTabItemsConfig/navTabItems";
import handleError from "../../../../utils/handleError";
import { Slide, toast } from "react-toastify";
import {
  createDepartmentService,
  deleteDepartmentService,
  getAllDepartmentsService,
  updateDepartmentService,
} from "../../services/department.services";
import Alert from "../../../../shared/components/Alert/Alert";
import PreLoader from "../../../../shared/components/PreLoader/PreLoader";
import FormInput from "../../../../shared/components/FormInput/FormInput";
import { GoPlus } from "react-icons/go";
import { MdOutlineStorage } from "react-icons/md";
import { useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

// Department validation schema
const createDepartmentValidationSchema = () =>
  yup.object().shape({
    department_name: yup
      .string()
      .required("Department title is required.")
      .max(255, "Department title must not exceed 255 characters."),
    department_description: yup
      .string()
      .required("Department description is required.")
      .max(500, "Department Description is too long."),
  });

const ManageDepartments = () => {
  const [departmentData, setDepartmentData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const [formMode, setFormMode] = useState("create");
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  // State for displayed dept
  const [displayedDeptCount, setDisplayedDeptCount] = useState(6);
  const updateRef = useRef(null);

  // Dept validation schema
  const deptValidationSchema = createDepartmentValidationSchema(formMode);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(deptValidationSchema),
    mode: "onSubmit", // Trigger validation only on submit
  });

  // A function that handle active status
  const handleTabClick = (index) => setActiveTab(index);

  // Truncate the description if it exceeds the limit
  const truncateDescription = (blog_description, limit = 144) => {
    return blog_description.length > limit
      ? `${blog_description.slice(0, limit)}...`
      : blog_description;
  };

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

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setApiErrors(null);
      // Build JSON payload per API docs
      const payload = {
        department_name: data.department_name,
        department_description: data.department_description,
      };

      if (formMode === "update" && selectedDeptId) {
        // For update, ensure payload matches new structure
        const updatePayload = {
          department_name: data.department_name,
          department_description: data.department_description,
        };
        const response = await updateDepartmentService(
          selectedDeptId,
          updatePayload,
        );

        if (response.success === true || response.success === "true") {
          // refetch updated dept
          await fetchAllDepartments();
          toast.success(response?.message, {
            autoClose: 3000,
            theme: "colored",
            transition: Slide,
          });

          reset();
          setFormMode("create");
          setSelectedDeptId(null);
        }
      } else {
        const response = await createDepartmentService(payload);

        if (response.success === true || response.success === "true") {
          // refetch updated dept
          await fetchAllDepartments();
          toast.success(response?.message, {
            autoClose: 3000,
            theme: "colored",
            transition: Slide,
          });

          reset();
        }
      }
    } catch (error) {
      setApiErrors(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle update on edit button clicked
  const handleUpdateDepartment = (dept) => {
    setFormMode("update");
    setSelectedDeptId(dept.id || "");

    // Prepopulate blog_title robustly
    setValue("department_name", dept.department_name || "");
    setValue("department_description", dept.department_description || "");
    if (updateRef.current) {
      updateRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle dept deletion
  const handleDeleteDepartment = async (deptId) => {
    try {
      setIsLoading(true);
      setApiErrors(null);

      // Call delete service
      const response = await deleteDepartmentService(deptId);
      if (response.success === true || response.success === "true") {
        await fetchAllDepartments();
        toast.success(response?.message, {
          autoClose: 3000,
          theme: "colored",
          transition: Slide,
        });
      }
    } catch (error) {
      setApiErrors(handleError(error)); // Handle errors gracefully
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.value) {
      clearErrors(e.target.name);
    }
  };

  //  A custom validation function that validates the fields one by one and sets the first encountered error.
  const handleDeptValidation = async (e) => {
    e.preventDefault();
    const values = getValues();
    try {
      await deptValidationSchema?.validate(values, {
        abortEarly: false,
      });
      handleSubmit(onSubmit)();
    } catch (validationError) {
      const firstError = validationError.inner[0];
      if (firstError) {
        setError(firstError.path, { message: firstError.message });
      }
    }
  };

  //   handle Show More
  const handleShowMore = () => {
    setDisplayedDeptCount(departmentData?.length); // Show all department
  };
  //   handle Show Less
  const handleShowLess = () => {
    setDisplayedDeptCount(6); // Reset to showing only 6 departments
  };
  return (
    <main id="main" className="main">
      <Breadcrumb items={breadcrumbItems?.dashboard?.department} />
      <DashboardTitle
        title="Manage departments"
        subtitle="Manage our enat healthcare departments."
        border="border"
      />
      <section className="dashboard dashboard-section">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              <div className="col-12">
                <NavTabs
                  tabItems={navTabItems?.departmentAndDoctorNavTabItems}
                  activeTab={activeTab}
                  onTabClick={handleTabClick}
                />
                {apiErrors && (
                  <Alert
                    message={apiErrors}
                    alertBg="bg-red-25"
                    alertClass="alert-danger"
                    messageColor="text-danger"
                  />
                )}
                {isLoading ? (
                  <PreLoader />
                ) : (
                    <div
                      className={`p-block-30 ${styles["form-section-wrapper"]}`}
                    >
                      <form
                        onSubmit={handleDeptValidation}
                        noValidate
                        ref={updateRef}
                      >
                        <div className="col-md-12">
                          <div
                            className={`${styles["input-field-main-wrapper"]}`}
                          >
                            <div
                              className={`${styles["input-field-title-wrapper"]}`}
                            >
                              <div
                                className={`${styles["input-field-title-icon-wrapper"]}`}
                              >
                                <div
                                  className={`${styles["inner-icon-wrapper"]}`}
                                >
                                  <MdOutlineStorage />
                                </div>
                              </div>
                              <h3>
                                {formMode === "create"
                                  ? "Add Departments"
                                  : "Update Departments"}
                                <label
                                  className={`${styles["line-end"]}`}
                                ></label>
                              </h3>
                            </div>

                            <div className={`${styles["input-field-wrapper"]}`}>
                              <div className="row">
                                <div className="col-12">
                                  <div className="col-lg-12 col-md-12">
                                    <FormInput
                                      label="Department Name"
                                      type="text"
                                      name="department_name"
                                      placeholder="Enter department name"
                                      register={register}
                                      onInputChange={handleInputChange}
                                      error={errors.department_name}
                                    />
                                  </div>
                                  <div className="col-lg-12 col-md-12">
                                    <div className={`${styles["form-group"]}`}>
                                      <label>
                                        Department Description:{" "}
                                        <span
                                          className={`${styles["required"]}`}
                                        >
                                          *
                                        </span>
                                      </label>
                                      <textarea
                                        cols="45"
                                        rows="3"
                                        placeholder="Enter department description ..."
                                        className={`form-control  ${
                                          errors.department_description
                                            ? styles["is-invalid"]
                                            : ""
                                        }`}
                                        {...register("department_description")}
                                        onChange={handleInputChange}
                                      />
                                      {errors.department_description && (
                                        <div className="d-block invalid-feedback">
                                          {
                                            errors.department_description
                                              .message
                                          }
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <button className="main-btn w-100" type="submit">
                                {formMode === "create"
                                  ? "Save & create"
                                  : "Update Department"}
                                <GoPlus size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                
                )}
              </div>
            </div>
            {/* render department data */}
            {departmentData.length > 0 && (
              <div className="col-12 mt-4">
                <div className="card">
                  <div>
                    <h5 className="card-title">
                      List of Departments <span>/ </span>
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="news">
                      {departmentData
                        ?.slice(0, displayedDeptCount)
                        ?.map((dept) => (
                          <div
                            key={`dept-${dept?.id}`}
                            className="post-item clearfix border-bottom"
                          >
                            <div className="d-flex flex-column flex-sm-row align-items-sm-center">
                              <div className={`${styles["dept-title-wrapper"]}`}>
                                <h4>{dept?.department_name}</h4>
                              </div>
                            </div>
                            <div className=" mt-2">
                              <p>
                                {truncateDescription(
                                  dept?.department_description,
                                )}
                              </p>
                            </div>

                            <div className="d-flex justify-content-end align-items-center px-5 py-3">
                              <div
                                onClick={() => handleUpdateDepartment(dept)}
                                className="update-icon-wrapper"
                              >
                                <FaRegEdit />
                              </div>
                              <div
                                onClick={() =>
                                  handleDeleteDepartment(dept.id)
                                }
                                className="delete-icon-wrapper"
                              >
                                <FaTrashCan />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="d-flex justify-content-center align-items-center text-center mt-4 mb-1">
                      {departmentData.length > 6 && (
                        <>
                          {displayedDeptCount < departmentData.length ? (
                            <button
                              className="main-btn"
                              onClick={handleShowMore}
                            >
                              Show More Dep't
                            </button>
                          ) : (
                            <button
                              className="main-btn"
                              onClick={handleShowLess}
                            >
                              Show Less Dep't
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-4">
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
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ManageDepartments;
