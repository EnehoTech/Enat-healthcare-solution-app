import { useEffect, useState } from "react";
import styles from "./UploadAsset.module.css";
import { SlCloudUpload } from "react-icons/sl";

const UploadAsset = ({
  label,
  name,
  inputLabel,
  required = true,
  size,
  fileTypes,
  mobileViewFileTypes,
  onFileChange,
  errors,
  setValue,
  resetPreview,
  previewAssetOnUpdate,
  isUpdateMode = false,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [previewFileName, setPreviewFileName] = useState("");
  const [preview, setPreview] = useState(null);

  // Handle screen resize and update `isMobile` state
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 992);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //  Reset the file name  and preview icon when resetPreview is called.
  useEffect(() => {
    if (resetPreview) {
      setPreviewFileName("");
      setPreview(null);
    }
  }, [resetPreview]);

  // Set preview for update mode
  useEffect(() => {
    if (
      isUpdateMode &&
      typeof previewAssetOnUpdate === "string" &&
      (previewAssetOnUpdate?.startsWith("http://") ||
        previewAssetOnUpdate?.startsWith("https://"))
    ) {
      setPreviewFileName(
        new URL(previewAssetOnUpdate).pathname.split("/").pop()
      );
      setPreview(previewAssetOnUpdate); // Set preview to the existing icon image
    }
  }, [isUpdateMode, previewAssetOnUpdate]);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setPreviewFileName(file?.name); // Store the file name
      setValue(name, file); // Update the form state via setValue
      onFileChange(file); // Optionally call the parent function
      // Use FileReader to create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Store the image as a base64 URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL for preview
    }
  };
  return (
    <div className={`${styles["upload-asset"]}`}>
      {label && (
        <label htmlFor={name} className={`${styles["upload-asset-label"]}`}>
          {label}:
          {required && <span className={`${styles["required"]}`}>*</span>}
        </label>
      )}
      <div
        className={`d-flex flex-column align-items-center  ${
          styles["upload-asset-wrapper"]
        } ${errors[name] ? styles["is-invalid"] : ""} `}
      >
        {preview ? (
          <div className={`${styles["upload-asset-preview-icon"]}`}>
            {/* Display the selected icon */}
            <img
              src={preview}
              alt="previewed image/Icon"
              crossOrigin="anonymous"
            />
          </div>
        ) : (
          <div className={`${styles["upload-asset-bg"]}`}>
            <SlCloudUpload className={`${styles["upload-asset-icon"]}`} />
          </div>
        )}

        <div className="d-flex flex-column  gap-3 ">
          <div className={`${styles["upload-asset-guidelines"]}`}>
            <p className="mb-3">{size}</p>
            <p className="mb-3">
              {isMobile ? <span>{mobileViewFileTypes}</span> : fileTypes}
            </p>
          </div>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
            <div className={`${styles["upload-asset-input-wrapper"]}`}>
              <input
                type="file"
                className={`${styles["upload-asset-input"]}`}
                onChange={handleFileInputChange}
              />
              {inputLabel && (
                <label
                  htmlFor={name}
                  className={`${styles["upload-asset-input-label"]}`}
                >
                  {inputLabel}
                </label>
              )}
            </div>
            {/* Display the file name next to the input label */}
            {previewFileName && (
              <div className={`${styles["upload-asset-file-name"]} ms-2`}>
                <p>{previewFileName}</p> {/* Display the selected file name */}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Display errors */}
      {errors[name] && <p className="text-danger">{errors[name]?.message}</p>}
    </div>
  );
};

export default UploadAsset;
