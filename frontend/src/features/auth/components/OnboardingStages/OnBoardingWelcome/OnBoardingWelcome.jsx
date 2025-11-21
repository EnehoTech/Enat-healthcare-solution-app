import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./OnBoardingWelcome.module.css";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import PreLoader from "../../../../../shared/components/PreLoader/PreLoader";
import Alert from "../../../../../shared/components/Alert/Alert";
import handleError from "../../../../../utils/handleError";
import { fetchOnboardingStage } from "../../../../../redux/slices/onboardingSlice";
import { updateUserOnboardingStageService } from "../../../services/auth.service";
import OnboardingStageIndicator from "../OnboardingStageIndicator/OnboardingStageIndicator";

const OnBoardingWelcome = () => {
  // destructure user data from global state
  const { isAuth, firstName, lastName } = useSelector((state) => state?.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);
  const dispatch = useDispatch(); // Initialize the useDispatch hook
  const { handleSubmit } = useForm();
  // Function to handle form submission
  const onSubmit = async () => {
    try {
      setIsLoading(true);
      setApiErrors(null);
      const response = await updateUserOnboardingStageService();
      if (response.success === true) {
        dispatch(fetchOnboardingStage());
      }
    } catch (error) {
      // Handle error
      console.error("Error while updating stage ID:", error);
      setApiErrors(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading ? (
        <PreLoader />
      ) : (
        <section
          className={`p-block-70 ${styles["onboarding-section-wrapper"]}`}
        >
          <section className="container">
            {apiErrors && (
              <Alert
                message={apiErrors}
                alertBg="bg-red-25"
                alertClass="alert-danger"
                messageColor="text-danger"
              />
            )}
            <section className={`${styles["welcome-onboard-content-wrapper"]}`}>
              <div className={`${styles["welcome-onboard-user"]}`}>
                {isAuth && (
                  <h3 className="mb-0">
                    Hello, {firstName} {lastName}
                  </h3>
                )}
                <div className={`${styles["welcome-onboard-section"]}`}></div>
              </div>
              <div className={`${styles["welcome-onboard-message"]} `}>
                <h5>To Enat Health Care Solutions</h5>
                <p>
                  We're delighted to welcome you to Enat Health Care Solutions!
                  Together, we will strengthen our community, celebrate our
                  values, and make a lasting impact in healthcare.
                </p>
              </div>
              <form
                className={`d-flex align-items-center justify-content-center ${styles["onboarding-welcome-btn"]}`}
                onSubmit={handleSubmit(onSubmit)}
              >
                <button className="main-btn" type="submit">
                  Save & Go Home
                  <GoPlus size={18} />
                </button>
              </form>
            </section>
            <OnboardingStageIndicator currentStage={2} />
          </section>
        </section>
      )}
    </>
  );
};

export default OnBoardingWelcome;
