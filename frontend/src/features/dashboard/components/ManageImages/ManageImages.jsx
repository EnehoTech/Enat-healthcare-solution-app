import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// styles
import styles from "./ManageImages.module.css";
// Icons & UI
import { MdOutlineStorage } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
// shared components
import StoryBoard from "../StoryBoard/StoryBoard";
import { images } from "../../../../constants/AssetsContainer";
import Breadcrumb from "../../../../shared/components/Breadcrumb/Breadcrumb";
import { breadcrumbItems } from "../../../../constants/appConfig/breadcrumbItemsConfig/breadcrumbItems";
import DashboardTitle from "../DashboardTitle/DashboardTitle";
import NavTabs from "../../../../shared/components/NavTabs/NavTabs";
import Alert from "../../../../shared/components/Alert/Alert";
import FormInput from "../../../../shared/components/FormInput/FormInput";
import UploadAsset from "../../../../shared/components/UploadAsset/UploadAsset";
import PreLoader from "../../../../shared/components/PreLoader/PreLoader";

// Config & Utils
import { navTabItems } from "../../../../constants/appConfig/navTabItemsConfig/navTabItems";
import handleError from "../../../../utils/handleError";

// API Services
import {
  createGalleryImageService,
  deleteGalleryImageService,
  getAllGalleryImagesService,
  updateGalleryImageService,
} from "../../services/imageGallery.services";

// toast notifications
import { Slide, toast } from "react-toastify";
import { formatDateWithMonthName } from "../../../../utils/formatDate";

// validation schema
// Image Upload Validation Schema
export const imageUploadValidationSchema = (formMode) =>
  yup.object().shape({
    image_name: yup
      .string()
      .required("Image name is required.")
      .max(120, "Image name must not exceed 120 characters."),

    image_type: yup
      .string()
      .required("Image type is required.")
      .oneOf(
        ["BLOG", "BLOG_DETAIL"],
        "Image type must be BLOG or BLOG_DETAIL.",
      ),

    image_url:
      formMode === "create"
        ? yup
            .mixed()
            .required("Image file is required.")
            .test("fileValidation", "Please upload a valid file.", (value) => {
              if (!value) return false;
              return value instanceof File;
            })
            .test(
              "fileSize",
              "File is too large. Max size is 2MB.",
              (value) => {
                if (!value) return true;
                return value.size <= 2000000;
              },
            )
            .test(
              "fileType",
              "Unsupported file format. Please upload jpg, jpeg, png, svg, gif, webp, or avif.",
              (value) => {
                if (!value) return true;
                return [
                  "image/jpg",
                  "image/jpeg",
                  "image/png",
                  "image/svg+xml",
                  "image/gif",
                  "image/webp",
                  "image/avif",
                ].includes(value.type);
              },
            )
        : yup.mixed().nullable(),
  });

export const imageTypeLabelMap = {
  BLOG: "Blog",
  BLOG_DETAIL: "Blog Detail",
};

export const getImageTypeLabel = (type) => {
  return imageTypeLabelMap[type] ?? type;
};

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageImages = () => {
  // data state
  const [imageData, setImageData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);

  // Upload preview
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [resetPreview, setResetPreview] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // Form mode
  const [formMode, setFormMode] = useState("create"); // "create" | "update"
  const [selectedImageId, setSelectedImageId] = useState(null);

  // list display
  const [displayedCount, setDisplayedCount] = useState(9);

  // filter
  const [filterType, setFilterType] = useState(""); // "" | BLOG | BLOG_DETAIL

  const updateRef = useRef(null);
  const schema = imageUploadValidationSchema(formMode);
  //   react hook form handler
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
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      image_name: "",
      image_type: "",
      image_url: null,
    },
  });

  // A function that handle active status
  const handleTabClick = (index) => setActiveTab(index);

  // Fetch all images
  useEffect(() => {
    fetchAllImages();
  }, [filterType]);

  const fetchAllImages = async () => {
    try {
      setIsLoading(true);
      setApiErrors(null);

      // Pass filterType directly as string, not as object
      const params = filterType;
      const response = await getAllGalleryImagesService(params);
      if (response?.success === true) {
        setImageData(response?.data?.images || []);
      }
    } catch (error) {
      setApiErrors(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };
  // handle onsubmit
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setApiErrors(null);

      const formData = new FormData();
      formData.append("image_name", data.image_name);
      formData.append("image_type", data.image_type);

      if (formMode === "update" && selectedImageId) {
        // Only send file if exists (important for update mode)
        if (selectedImageUrl instanceof File) {
          formData.append("image_url", selectedImageUrl);
        }
        const response = await updateGalleryImageService(
          selectedImageId,
          formData,
        );

        if (response?.success === true) {
          // Update local list if backend returns updated record, else refetch
          const updatedImage =
            response?.data?.image || response?.data?.images || null;

          if (updatedImage) {
            const updated = imageData?.map((img) =>
              img.id === selectedImageId ? { ...img, ...updatedImage } : img,
            );
            setImageData(updated);
          } else {
            await fetchAllImages();
          }

          toast.success(response?.message || "Image updated successfully.", {
            autoClose: 3000,
            theme: "colored",
            transition: Slide,
          });

          reset();
          setFormMode("create");
          setSelectedImageId(null);
          setIsUpdateMode(false);
          setSelectedImageUrl(null);
          setResetPreview(true);
        }
      } else {
        // create mode: must include file
        formData.append("image_url", selectedImageUrl);

        const response = await createGalleryImageService(formData);

        if (response?.success === true) {
          const created =
            response?.data?.image || response?.data?.images || null;

          if (created) {
            setImageData((prev) => [created, ...prev]);
          } else {
            await fetchAllImages();
          }

          toast.success(response?.message || "Image uploaded successfully.", {
            autoClose: 3000,
            theme: "colored",
            transition: Slide,
          });

          reset();
          setSelectedImageUrl(null);
          setResetPreview(true);
        }
      }
    } catch (error) {
      setApiErrors(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };
  // A custom validation function that validates the fields one by one and sets the first encountered error.
  const handleImageUploadValidation = async (e) => {
    e.preventDefault();

    try {
      const values = getValues();

      await schema.validate(values, { abortEarly: false });

      handleSubmit(onSubmit)();
    } catch (validationError) {
      if (validationError?.inner?.length > 0) {
        const firstError = validationError.inner[0];
        if (firstError)
          setError(firstError.path, { message: firstError.message });
      } else {
        console.error("Unexpected validation error:", validationError);
      }
    }
  };
  const handleInputChange = (e) => {
    if (e.target.value) clearErrors(e.target.name);
  };

  const handleFileChange = (file) => {
    setValue("image_url", file);
    setSelectedImageUrl(file);
    clearErrors("image_url");
  };
  //   handle image upload update
  const handleUpdate = (img) => {
    setFormMode("update");

    // set selected image id
    const id = img?.id;
    setSelectedImageId(id);

    setValue("image_name", img?.image_name || "");
    setValue("image_type", img?.image_type || "");

    // For preview: use URL string
    setSelectedImageUrl(
      img?.image_url ? `${API_BASE_URL}${img.image_url}` : null,
    );

    setResetPreview(false);
    setIsUpdateMode(true);

    if (updateRef.current)
      updateRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleDelete = async (imageId) => {
    try {
      setIsLoading(true);
      setApiErrors(null);

      const response = await deleteGalleryImageService(imageId);

      if (response?.success === true) {
        // remove locally (or refetch)
        setImageData((prev) =>
          prev.filter((img) => (img?.id ?? img?.image_gallery_id) !== imageId),
        );

        toast.success(response?.message || "Image deleted successfully.", {
          autoClose: 3000,
          theme: "colored",
          transition: Slide,
        });
      }
    } catch (error) {
      setApiErrors(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMore = () => setDisplayedCount(imageData.length);
  const handleShowLess = () => setDisplayedCount(9);

  // Image type options for select dropdown
  const imageTypeOptions = [
    { value: "", label: "Select Image type" },
    { value: "BLOG", label: "Blog" },
    { value: "BLOG_DETAIL", label: "Blog Detail" },
  ];

  const filterTypeOptions = [
    { value: "", label: "All Types" },
    { value: "BLOG", label: "Blog" },
    { value: "BLOG_DETAIL", label: "Blog Detail" },
  ];
  return (
    <main id="main" className="main">
      <Breadcrumb items={breadcrumbItems?.dashboard?.image} />
      <DashboardTitle
        title="Manage Images"
        subtitle="Upload and manage images."
        border="border"
      />
      <section className="dashboard dashboard-section">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              <div className="col-12">
                <NavTabs
                  tabItems={navTabItems?.blogAndImagesNavTabItems}
                  activeTab={activeTab}
                  onTabClick={handleTabClick}
                />
                {isLoading ? (
                  <PreLoader />
                ) : (
                  <div
                    className={`p-block-30 ${styles["form-section-wrapper"]}`}
                  >
                    <form
                      onSubmit={handleImageUploadValidation}
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
                              Upload Images
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
                              <div className="col-12">
                                <div className="col-lg-12 col-md-12">
                                  <FormInput
                                    label="Image Name"
                                    type="text"
                                    name="image_name"
                                    placeholder="Enter image name"
                                    register={register}
                                    onInputChange={handleInputChange}
                                    error={errors.image_name}
                                  />
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <UploadAsset
                                    label="Upload Image"
                                    inputLabel="Upload"
                                    name="image_url"
                                    size={
                                      <>
                                        Image size guidelines:{" "}
                                        <span>Min: 360 x 350</span>
                                      </>
                                    }
                                    mobileFileTypes="jpg, jpeg, gif, svg, png, webp, avif"
                                    fileTypes={
                                      <>
                                        Upload Image Type Guideline:{" "}
                                        <span>
                                          jpg, jpeg, png, gif, svg, webp, avif
                                        </span>
                                      </>
                                    }
                                    onFileChange={handleFileChange}
                                    setValue={setValue}
                                    errors={errors}
                                    resetPreview={resetPreview}
                                    previewAssetOnUpdate={selectedImageUrl}
                                    isUpdateMode={isUpdateMode}
                                  />
                                </div>

                                {/* image type selector */}
                                <div className="col-lg-12 col-md-12">
                                  <div className={styles["form-group"]}>
                                    <label>
                                      Image Type:
                                      <span className={styles["required"]}>
                                        {" "}
                                        *
                                      </span>
                                    </label>

                                    <select
                                      className={`form-control ${
                                        errors.image_type
                                          ? styles["is-invalid"]
                                          : ""
                                      }`}
                                      {...register("image_type")}
                                      name="image_type"
                                      onChange={handleInputChange}
                                    >
                                      {imageTypeOptions?.map((opt) => (
                                        <option
                                          key={opt.value || "placeholder"}
                                          value={opt.value}
                                        >
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>

                                    {errors.image_type && (
                                      <div className="d-block invalid-feedback">
                                        {errors.image_type.message}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <button className="main-btn w-100" type="submit">
                              {formMode === "create"
                                ? "Upload  & Save Image "
                                : "Update Image"}
                              <GoPlus size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              {/* Filter + List */}
              {imageData?.length > 0 && (
                <div className="col-12 mt-4">
                  <div className="card">
                    <div
                      className={`${styles["image-card-title-wrapper"]} d-flex flex-column flex-sm-row justify-content-between align-items-sm-center py-3`}
                    >
                      <h5 className="card-title mb-2 mb-sm-0">
                        List Of Images <span>/</span>
                      </h5>

                      {/* filter */}
                      <div className={`${styles["filter-by"]} `}>
                        <div className={styles["form-group"]}>
                          <label className="pb-2">filter By:</label>
                          <select
                            className="form-control"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                          >
                            {filterTypeOptions?.map((opt) => (
                              <option
                                key={opt.value || "placeholder-value"}
                                value={opt.value}
                              >
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="row">
                        {imageData.slice(0, displayedCount).map((img) => {
                          const id = img?.id;
                          const url = img?.image_url
                            ? `${API_BASE_URL}${img.image_url}`
                            : "";

                          return (
                            <div className="col-md-6 col-xl-4 mb-4" key={id}>
                              <div className={styles["image-card"]}>
                                <div className={styles["image-thumb"]}>
                                  <img
                                    src={url}
                                    alt={
                                      img?.image_name || `gallery-image-${id}`
                                    }
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                  />
                                </div>

                                <div className={styles["image-meta"]}>
                                  <h4 className={styles["image-name"]}>
                                    {img?.image_name}
                                  </h4>

                                  <p className={styles["image-type"]}>
                                    <strong>Image Type: </strong>

                                    <span>
                                      {getImageTypeLabel(img?.image_type)}
                                    </span>
                                  </p>

                                  {img?.user && (
                                    <p className={styles["uploaded-by"]}>
                                      <strong>Uploaded By: </strong>
                                      {img?.user?.first_name}{" "}
                                      {img?.user?.last_name}
                                    </p>
                                  )}
                                  {img?.created_at && (
                                    <p className={styles["image-date"]}>
                                      <strong>Uploaded date: </strong>
                                      {formatDateWithMonthName(img.created_at)}
                                    </p>
                                  )}
                                  <div className="d-flex justify-content-end align-items-center px-2 py-2">
                                    <div
                                      onClick={() => handleUpdate(img)}
                                      className="update-icon-wrapper"
                                    >
                                      <FaRegEdit />
                                    </div>
                                    <div
                                      onClick={() => handleDelete(id)}
                                      className="delete-icon-wrapper"
                                    >
                                      <FaTrashCan />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-center mt-2">
                        {imageData.length > 9 && (
                          <>
                            {displayedCount < imageData.length ? (
                              <button
                                className="main-btn"
                                onClick={handleShowMore}
                              >
                                Show More Blogs
                              </button>
                            ) : (
                              <button
                                className="main-btn"
                                onClick={handleShowLess}
                              >
                                Show Less Blogs
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
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ManageImages;
