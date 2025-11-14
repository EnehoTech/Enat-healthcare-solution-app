import  { useState } from 'react'
import styles from "./AddEmployeeForm.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Breadcrumb from '../../../../shared/components/Breadcrumb/Breadcrumb';
import { breadcrumbItems } from '../../../../constants/appConfig/breadcrumbItemsConfig/breadcrumbItems';
import DashboardTitle from '../DashboardTitle/DashboardTitle';
import { images } from '../../../../constants/AssetsContainer';
import handleError from '../../../../utils/handleError';
import { MdOutlineStorage } from "react-icons/md";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import FormInput from "../../../../shared/components/FormInput/FormInput";
import Alert from '../../../../shared/components/Alert/Alert';
import { signUpService } from '../../../auth/services/auth.service';
import { Slide, toast } from "react-toastify";
import PreLoader from '../../../../shared/components/PreLoader/PreLoader';
import StoryBoard from '../StoryBoard/StoryBoard';


// Define the validation schema using yup
const addEmployeeValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required.")
    .test("is-valid-email", "Email is not valid.", (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value.trim());
    }),
  first_name: yup.string().required("First name is required."),
  last_name: yup.string().required("Last name is required."),
  phone_number: yup.string().required("Phone number is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .matches(/(?=.*[0-9])/, "Password must contain a number.")
    .matches(/(?=.*[a-zA-Z])/, "Password must contain a letter.")
    .matches(
      /(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain a special character."
    ),
});

function AddEmployeeForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiErrors, setApiErrors] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const {
      register,
      handleSubmit,
      setError,
      clearErrors,
      reset,
      getValues,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(addEmployeeValidationSchema),
      mode: "onSubmit", // Trigger validation only on submit
    });

    const onSubmit = async (data) => {
      try {
        setIsLoading(true);
        setApiErrors(null);
        const response = await signUpService(data);
        if (response.success === true || response.success === "true") {
          toast.success(response?.message, {
            autoClose: 3000,
            theme: "colored",
            transition: Slide,
          });
          reset();
        }
        // Reset the form fields after successful submission
      } catch (error) {
        console.error("API request error:", handleError(error));
        setApiErrors(handleError(error));
      } finally {
        setIsLoading(false);
      }
    };

    const handleInputChange = (e) => {
      if (e.target.value) {
        clearErrors(e.target.name);
      }
    };
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    //  a custom validation function that validates the fields one by one and sets the first encountered error.
    const handleSignUpValidation = async (e) => {
      e.preventDefault();
      const values = getValues();
      try {
        await addEmployeeValidationSchema.validate(values, {
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
  return (
    <main id="main" className="main">
      <Breadcrumb items={breadcrumbItems?.dashboard?.addEmployee} />

      <DashboardTitle
        title="Add Employee"
        subtitle="Add enat health care employee here."
        border="border"
      />
      <section className="dashboard dashboard-section">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              <div className="col-12">
                {isLoading ? (
                  <PreLoader />
                ) : (
                  <div
                    className={`p-block-30 ${styles["form-section-wrapper"]}`}
                  >
                    <form onSubmit={handleSignUpValidation} noValidate>
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
                              Add Employee
                              <label
                                className={`${styles["line-end"]}`}
                              ></label>
                            </h3>
                          </div>

                          <div className={`${styles["input-field-wrapper"]}`}>
                            {apiErrors && (
                              <Alert
                                message={apiErrors}
                                alertBg="bg-red-25"
                                alertClass="alert-danger"
                                messageColor="text-danger"
                              />
                            )}
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <FormInput
                                  label="E-mail Address"
                                  type="email"
                                  name="email"
                                  placeholder="Enter Email Address"
                                  register={register}
                                  onInputChange={handleInputChange}
                                  error={errors.email}
                                />
                              </div>

                              <div className="col-lg-6">
                                <FormInput
                                  label="First Name"
                                  type="text"
                                  name="first_name"
                                  placeholder="Enter First Name"
                                  register={register}
                                  onInputChange={handleInputChange}
                                  error={errors.first_name}
                                />
                              </div>
                              <div className="col-lg-6">
                                <FormInput
                                  label="Last Name"
                                  type="text"
                                  name="last_name"
                                  placeholder="Enter Last Name"
                                  register={register}
                                  onInputChange={handleInputChange}
                                  error={errors.last_name}
                                />
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <FormInput
                                  label="Phone Number"
                                  type="text"
                                  name="phone_number"
                                  placeholder="Enter Phone Number"
                                  register={register}
                                  onInputChange={handleInputChange}
                                  error={errors.phone_number}
                                />
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className={`${styles["form-group"]}`}>
                                  <label>
                                    Password:{" "}
                                    <span className={`${styles["required"]}`}>
                                      *
                                    </span>
                                  </label>
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="password"
                                    className={`form-control ${
                                      styles["sign-up-form-control"]
                                    } ${
                                      errors.password
                                        ? styles["is-invalid"]
                                        : ""
                                    }`}
                                    {...register("password")}
                                    onChange={handleInputChange}
                                  />
                                  <span
                                    className={` ${
                                      styles["hidden-password-icon"]
                                    } ${
                                      showPassword
                                        ? styles["show-password-icon-color"]
                                        : ""
                                    } ${
                                      errors.password
                                        ? styles["is-invalid-password"]
                                        : ""
                                    } `}
                                    onClick={togglePasswordVisibility}
                                  >
                                    {showPassword ? (
                                      <IoEyeOutline />
                                    ) : (
                                      <IoEyeOffOutline />
                                    )}
                                  </span>
                                  {errors.password && (
                                    <div className="d-block invalid-feedback">
                                      {errors.password.message}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button className="main-btn w-100" type="submit">
                              Add employee
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
}

export default AddEmployeeForm