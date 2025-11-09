import  { useState } from "react";
import styles from "./SignInForm.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdChevronRight } from "react-icons/md";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import Alert from "../../../../shared/components/Alert/Alert";
import PreLoader from "../../../../shared/components/PreLoader/PreLoader";
import handleError from "../../../../utils/handleError";
import { signInService } from "../../services/auth.service";

// Define the validation schema using yup
const signInvalidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required.")
    .test(
      "is-valid-email",
      "Please provide a valid email address.",
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value.trim());
      }
    ),
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
const SignInForm = () => {
  const [apiErrors, setApiErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(signInvalidationSchema),
    mode: "onSubmit", // Trigger validation only on submit
  });
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setApiErrors(null);
      const response = await signInService(data);
      // set user access token to local storage
      localStorage.setItem("_u_at_i", response?._u_at_i);
      // get access token stored in users local storage
      // const getAccessToken = localStorage.getItem("_u_at_i"); // _u_at_i stands for user access token Id.
      // if (getAccessToken) {
      //   // use the custom hooks to decode accessToken
      //   const decodedToken = await decodeAccessToken(getAccessToken);
      //   const decodedAuthData = {
      //     isAuth: true,
      //     u_id: decodedToken.u_id,
      //     role_id: decodedToken.role_id,
      //     stage_id: decodedToken.stage_id,
      //     email: decodedToken.email,
      //     first_name: decodedToken.first_name,
      //     last_name: decodedToken.last_name,
      //     user_name: decodedToken.user_name,
      //   };
      // } else {
      //   throw new Error("Access token not found.");
      // }

      // use the custom hooks to decode accessToken
      if (response.success === true) {
        navigate("/");
      }
      // Reset the form fields after successful submission
      reset();
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
  const handleSignInValidation = async (e) => {
    e.preventDefault();
    const values = getValues();
    try {
      await signInvalidationSchema.validate(values, { abortEarly: false });
      handleSubmit(onSubmit)();
    } catch (validationError) {
      const firstError = validationError.inner[0];
      if (firstError) {
        setError(firstError.path, { message: firstError.message });
      }
    }
  };
  return (
    <>
      {isLoading ? (
        <PreLoader />
      ) : (
        <div className={`bg-light ${styles["sign-in-wrapper"]}`}>
          <div className="container">
            <div className={`${styles["sign-in-form"]}`}>
              <h3>
                Sign In <label className={`${styles["line-end"]}`}></label>
              </h3>
              <div className={`${styles["welcome-back-text"]}`}>
                Welcome Back! &nbsp;
                <span>Please log in to your account. </span>
              </div>
              {apiErrors && (
                <Alert
                  message={apiErrors}
                  alertBg="bg-red-25"
                  alertClass="alert-danger"
                  messageColor="text-danger"
                />
              )}
              <form onSubmit={handleSignInValidation} noValidate>
                <div className={`${styles["form-group"]}`}>
                  <input
                    type="email"
                    placeholder="E-mail address"
                    className={`form-control ${
                      styles["sign-in-form-control"]
                    } ${errors.email ? styles["is-invalid"] : ""}`}
                    {...register("email")}
                    onChange={handleInputChange}
                  />
                  {/* {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )} */}
                </div>

                <div className={`${styles["form-group"]}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    className={`form-control ${
                      styles["sign-in-form-control"]
                    }  ${errors.password ? styles["is-invalid"] : ""}`}
                    {...register("password")}
                    onChange={handleInputChange}
                  />
                  <span
                    className={`${styles["hidden-password-icon-signIn"]} ${
                      showPassword
                        ? styles["show-password-icon-signIn-color"]
                        : ""
                    }  
                  ${errors.password ? styles["is-invalid-password"] : ""}`}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                  </span>
                </div>
                <div className="row align-items-center">
                  <div
                    className={`col-lg-12 col-md-12 col-sm-12 ${styles["forgot-password-wrapper"]}`}
                  >
                    <Link to={"#"} className={`${styles["forgot-password"]}`}>
                      forgot password?
                    </Link>
                  </div>
                </div>
                <button className="main-btn w-100" type="submit">
                  Sign In
                  <MdChevronRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignInForm;
