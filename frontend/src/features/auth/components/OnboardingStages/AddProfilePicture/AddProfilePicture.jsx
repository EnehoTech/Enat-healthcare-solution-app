import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./AddProfilePicture.module.css";
import { GoPlus } from "react-icons/go";
import { SlCloudUpload } from "react-icons/sl";
import { RiSkipRightLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { Slide, toast } from "react-toastify";
import Alert from "../../../../../shared/components/Alert/Alert";
import PreLoader from "../../../../../shared/components/PreLoader/PreLoader";
import handleError from "../../../../../utils/handleError";
import { uploadProfilePictureService } from "../../../services/auth.service";
import UploadAsset from "../../../../../shared/components/UploadAsset/UploadAsset";
import { fetchOnboardingStage } from "../../../../../redux/slices/onboardingSlice";
import OnboardingStageIndicator from "../OnboardingStageIndicator/OnboardingStageIndicator";

const uploadProfilePictureSchema = yup.object().shape({
  profile_picture: yup
    .mixed()
    .nullable() // Allow null values
    .notRequired() // Make the field optional
    .test("fileExists", "Please upload a file.", (value) => {
      if (!value) return true; // Skip validation if no file is uploaded
      return value instanceof File; // Check if value is a file object
    })
    .test("fileSize", "File is too large. Max size is 2MB.", (value) => {
      if (!value) return true; // Skip validation if no file is uploaded
      return value.size <= 2000000; // Ensure file size is <= 2MB
    })
    .test(
      "fileType",
      "Unsupported file format. Please upload jpg, jpeg, png, or gif.",
      (value) => {
        if (!value) return true; // Skip validation if no file is uploaded
        return [
          "image/jpg",
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/avif",
        ].includes(value.type);
      }
    ),
});

const AddProfilePicture = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [resetPreview, setResetPreview] = useState(false);
  const dispatch = useDispatch(); // Initialize the useDispatch

  // Initialize the form with useForm and Yup resolver
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(uploadProfilePictureSchema),
    mode: "onSubmit",
    defaultValues: {
      profile_picture: null,
    },
  });
  const handleFileChange = (file) => {
    setValue("profile_picture", file); // Update the avatar in the form state
    setSelectedAvatar(file);
    clearErrors("profile_picture"); // Reset the input
  };

  // onSubmit function with async/await for API request
  const onSubmit = async () => {
    try {
      setIsLoading(true);
      setApiErrors(null);
      // Prepare the form data for submission
      const avatarData = new FormData();
      avatarData.append("profile_picture", selectedAvatar); // Submit the file

      // Make the API request
      const response = await uploadProfilePictureService(avatarData);
      if (response.success === true) {
        dispatch(fetchOnboardingStage());
        toast.success(response?.message, {
          autoClose: 1000,
          theme: "colored",
          transition: Slide,
        });
      }
      // Reset the form fields after successful submission
      reset();
      setSelectedAvatar(null); // Clear the selected avatar
      setResetPreview(true);
    } catch (error) {
      // Handle error
      setApiErrors(handleError(error));
      console.error(
        "API request error while uploading profile picture:",
        handleError(error)
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading ? (
        <PreLoader />
      ) : (
        <div className={`p-block-70 ${styles["onboarding-section-wrapper"]}`}>
          <div className="container">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="row">
                <div className="col-md-12">
                  <div className={`${styles["onboarding-content-wrapper"]}`}>
                    <div className={`${styles["input-field-title-wrapper"]}`}>
                      <div
                        className={`${styles["input-field-title-icon-wrapper"]}`}
                      >
                        <div className={`${styles["inner-icon-wrapper"]}`}>
                          <SlCloudUpload />
                        </div>
                      </div>

                      <h3>
                        Upload Your Profile picture
                        <label className={`${styles["line-end"]}`}></label>
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
                        <UploadAsset
                          label="Upload Profile Picture"
                          inputLabel="Upload"
                          required={false}
                          name="profile_picture"
                          size={
                            <>
                              Profile Picture Size Guidelines:{" "}
                              <span>60 x 60</span>
                            </>
                          }
                          mobileFileTypes="jpg, jpeg, gif, png, webp, avif"
                          fileTypes={
                            <>
                              Profile Picture File Type Guideline:
                              <span>jpg, jpeg, gif, png,webp, avif</span> no
                              text on the image
                            </>
                          }
                          onFileChange={handleFileChange}
                          setValue={setValue}
                          errors={errors}
                          resetPreview={resetPreview}
                        />
                      </div>

                      <div className="d-flex flex-column flex-md-row gap-3">
                        <button className="main-btn" type="submit">
                          Save & Continue
                          <GoPlus size={18} />
                        </button>
                        <button className="main-btn-light" type="submit">
                          Skip
                          <RiSkipRightLine size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <OnboardingStageIndicator currentStage={1} />
          </div>
        </div>
      )}
    </>
  );
};

export default AddProfilePicture;
