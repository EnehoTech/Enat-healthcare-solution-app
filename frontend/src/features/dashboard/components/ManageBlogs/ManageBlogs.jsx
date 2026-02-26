import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// styles
import styles from "./ManageBlogs.module.css";
// Icons & UI
import { MdOutlineStorage } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { TbUserCircle } from "react-icons/tb";
import { FaRegEdit } from "react-icons/fa";
import { FaCalendarDays, FaTrashCan } from "react-icons/fa6";

// redux
import { useSelector } from "react-redux";
// shared components
import StoryBoard from "../StoryBoard/StoryBoard";
import Breadcrumb from "../../../../shared/components/Breadcrumb/Breadcrumb";
import DashboardTitle from "../DashboardTitle/DashboardTitle";
import PreLoader from "../../../../shared/components/PreLoader/PreLoader";
import Alert from "../../../../shared/components/Alert/Alert";
import FormInput from "../../../../shared/components/FormInput/FormInput";
import NavTabs from "../../../../shared/components/NavTabs/NavTabs";

// config & utils
import handleError from "../../../../utils/handleError";
import { images } from "../../../../constants/AssetsContainer";
import { formatDateWithMonthName } from "../../../../utils/formatDate";
import { breadcrumbItems } from "../../../../constants/appConfig/breadcrumbItemsConfig/breadcrumbItems";
import { truncateDescription } from "../../../../utils/truncateDescription";
import { navTabItems } from "../../../../constants/appConfig/navTabItemsConfig/navTabItems";

// API services
import {
  createBlogService,
  deleteBlogService,
  getAllBlogsService,
  updateBlogService,
} from "../../services/blog.service";
import { imageGalleryByUserIdService } from "../../services/imageGallery.services";
// toast notifications
import { Slide, toast } from "react-toastify";

// blog validation schema
const createBlogValidationSchema = () =>
  yup.object().shape({
    image_gallery_id: yup
      .number()
      .typeError("Image gallery ID must be a number.")
      .integer("Image gallery ID must be an integer.")
      .positive("Image gallery ID must be positive.")
      .required("Image gallery ID is required."),
    blog_title: yup
      .string()
      .required("Blog title is required.")
      .max(255, "Blog title must not exceed 255 characters."),
    blog_description: yup
      .string()
      .required("Blog description is required.")
      .max(10000, "Description is too long."),
  });
// Api Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ManageBlogs = () => {
  // destructure user data from global state
  const { userId } = useSelector((state) => state?.auth);
  // data state
  const [blogsData, setBlogsData] = useState([]);
  const [imagesData, setImagesData] = useState([]);
  //   UI state
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);
  const [activeTab, setActiveTab] = useState(1);

  // Track form mode ('create' or 'update')
  const [formMode, setFormMode] = useState("create");
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  // State for displayed blogs
  const [displayedBlogsCount, setDisplayedBlogsCount] = useState(6);
  const updateRef = useRef(null);

  // blog validation schema
  const blogValidationSchema = createBlogValidationSchema(formMode);

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
    resolver: yupResolver(blogValidationSchema),
    mode: "onSubmit", // Trigger validation only on submit
  });

  // A function that handle active status
  const handleTabClick = (index) => setActiveTab(index);

  // Fetch all blogs
  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const fetchAllBlogs = async () => {
    try {
      setIsLoading(true);
      setApiErrors(null);
      const response = await getAllBlogsService();
      if (response.success === true || response.success === "true") {
        setBlogsData(response.data?.blogs || []);
      }
    } catch (error) {
      setApiErrors(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };
  const fetchAllImages = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      setApiErrors(null);
      const response = await imageGalleryByUserIdService(userId, "blog");
      if (response.success === true || response.success === "true") {
        setImagesData(response.data?.images || []);
      }
    } catch (error) {
      setApiErrors(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all images on userId change
  useEffect(() => {
    fetchAllImages();
  }, [userId]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setApiErrors(null);
      // Build JSON payload per API docs
      const payload = {
        image_gallery_id: data.image_gallery_id,
        blog_title: data.blog_title,
        blog_description: data.blog_description,
      };

      if (formMode === "update" && selectedBlogId) {
        // For update, ensure payload matches new structure
        const updatePayload = {
          image_gallery_id: data.image_gallery_id,
          blog_title: data.blog_title,
          blog_description: data.blog_description,
        };
        const response = await updateBlogService(selectedBlogId, updatePayload);

        if (response.success === true || response.success === "true") {
          // refetch updated blog
          fetchAllBlogs();
          toast.success(response?.message, {
            autoClose: 3000,
            theme: "colored",
            transition: Slide,
          });

          reset();
          setFormMode("create");
          setSelectedBlogId(null);
        }
      } else {
        const response = await createBlogService(payload);

        if (response.success === true || response.success === "true") {
          // refetch updated blog
          fetchAllBlogs();
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
  const handleUpdateBlog = (blog) => {
    setFormMode("update");
    setSelectedBlogId(blog.id || "");
    // Prepopulate image_gallery_id with correct value (from blog_img or fallback)
    setValue("image_gallery_id", blog.blog_img?.id || "");
    // Prepopulate blog_title robustly
    setValue("blog_title", blog.blog_title || "");
    setValue("blog_description", blog.blog_description || "");
    if (updateRef.current) {
      updateRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = async (blogId) => {
    try {
      setIsLoading(true);
      setApiErrors(null);

      // Call delete service
      const response = await deleteBlogService(blogId);
      if (response.success === true || response.success === "true") {
        await fetchAllBlogs();
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

  //  a custom validation function that validates the fields one by one and sets the first encountered error.
  const handleBlogsValidation = async (e) => {
    e.preventDefault();
    const values = getValues();
    try {
      await blogValidationSchema?.validate(values, {
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
    setDisplayedBlogsCount(blogsData.length); // Show all blogs
  };
  //   handle Show Less
  const handleShowLess = () => {
    setDisplayedBlogsCount(6); // Reset to showing only 6 blogs
  };

  return (
    <main id="main" className="main">
      <Breadcrumb items={breadcrumbItems?.dashboard?.blog} />
      <DashboardTitle
        title="Manage blogs"
        subtitle="Add insightful thoughts."
        border="border"
      />
      <section className="dashboard dashboard-section">
        <div className="row">
          <div className="col-lg-8">
            <div className="col-12">
              <NavTabs
                tabItems={navTabItems?.blogAndImagesNavTabItems}
                activeTab={activeTab}
                onTabClick={handleTabClick}
              />
              {isLoading ? (
                <PreLoader />
              ) : (
                <div className={`p-block-30 ${styles["form-section-wrapper"]}`}>
                  <form
                    onSubmit={handleBlogsValidation}
                    noValidate
                    ref={updateRef}
                  >
                    <div className="col-md-12">
                      <div className={`${styles["input-field-main-wrapper"]}`}>
                        <div
                          className={`${styles["input-field-title-wrapper"]}`}
                        >
                          <div
                            className={`${styles["input-field-title-icon-wrapper"]}`}
                          >
                            <div className={`${styles["inner-icon-wrapper"]}`}>
                              <MdOutlineStorage />
                            </div>
                          </div>
                          <h3>
                            {formMode === "create"
                              ? "Add Blog Posts"
                              : "Update Blog"}
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
                            <div className="col-12">
                              <div className="col-lg-12 col-md-12">
                                <div className={`${styles["form-group"]}`}>
                                  <label>
                                    Blog Image:
                                    <span className={`${styles["required"]}`}>
                                      *
                                    </span>
                                  </label>
                                  <select
                                    className={`form-control ${
                                      errors.image_gallery_id
                                        ? styles["is-invalid"]
                                        : ""
                                    }`}
                                    {...register("image_gallery_id")}
                                    onChange={handleInputChange}
                                  >
                                    <option
                                      className="select-place-holder"
                                      value=""
                                    >
                                      Select image for blog
                                    </option>
                                    {imagesData?.map((image) => (
                                      <option key={image?.id} value={image?.id}>
                                        {image?.image_name}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.image_gallery_id && (
                                    <div className="d-block invalid-feedback">
                                      {errors.image_gallery_id.message}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <FormInput
                                  label="Blog Title"
                                  type="text"
                                  name="blog_title"
                                  placeholder="Enter blog title"
                                  register={register}
                                  onInputChange={handleInputChange}
                                  error={errors.blog_title}
                                />
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className={`${styles["form-group"]}`}>
                                  <label>
                                    Blog Description:
                                    <span className={`${styles["required"]}`}>
                                      *
                                    </span>
                                  </label>
                                  <textarea
                                    cols="45"
                                    rows="3"
                                    placeholder="Enter blog description ..."
                                    className={`form-control  ${
                                      errors.blog_description
                                        ? styles["is-invalid"]
                                        : ""
                                    }`}
                                    {...register("blog_description")}
                                    onChange={handleInputChange}
                                  />
                                  {errors.blog_description && (
                                    <div className="d-block invalid-feedback">
                                      {errors.blog_description.message}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <button className="main-btn w-100" type="submit">
                            {formMode === "create"
                              ? "Save & Post"
                              : "Update Blog"}
                            <GoPlus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
            {/* render blogs data */}
            {blogsData.length > 0 && (
              <div className="col-12 mt-4">
                <div className="card">
                  <div>
                    <h5 className="card-title">
                      Blogs &amp; update <span>/ </span>
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="news">
                      {blogsData?.slice(0, displayedBlogsCount)?.map((blog) => (
                        <div
                          key={`blog-${blog?.id}`}
                          className="post-item clearfix border-bottom"
                        >
                          <div className="d-flex flex-column flex-sm-row align-items-sm-center">
                            <div className="align-self-start mt-0 mt-sm-2 mb-3 mb-sm-0">
                              <Link
                                to={`/blog-details?bdh=${blog?.blog_detail?.hash}`}
                              >
                                <div className="blog-image-wrapper">
                                  <img
                                    src={`${API_BASE_URL}${blog?.blog_img?.image_url}`}
                                    alt="blog banner"
                                    crossOrigin="anonymous"
                                    loading="lazy"
                                  />
                                </div>
                              </Link>
                            </div>
                            <div className="blog-content-title ps-0 ps-sm-3">
                              <h4>
                                <Link
                                  to={`/blog-details?bdh=${blog?.blog_detail?.hash}`}
                                >
                                  {blog.blog_title}
                                </Link>
                              </h4>
                              <div className="d-flex flex-column flex-sm-row gap-1 gap-sm-3 align-items-sm-center posted-by mt-2">
                                <div className="d-flex align-items-center">
                                  <TbUserCircle
                                    size={24}
                                    className="blog-icon"
                                  />
                                  <span className="ps-2">
                                    {blog?.user?.first_name}{" "}
                                    {blog?.user?.last_name}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <FaCalendarDays className="blog-icon" />
                                  <div>
                                    <span className="ps-2">
                                      {blog?.updated_at &&
                                        formatDateWithMonthName(
                                          blog.updated_at,
                                        )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="blog-content-desc mt-2">
                            <p>
                              {truncateDescription(blog.blog_description, 164)}
                            </p>
                          </div>
                          {blog?.blog_detail ? (
                            <div
                              className={`${styles["edit-blog-detail-wrapper"]} d-flex justify-content-end align-items-center px-2 px-sm-5 py-2`}
                            >
                              <Link
                                to={`/dashboard/add-blog-details`}
                                state={{ blogId: blog.id }}
                              >
                                <FaRegEdit />{" "}
                                <span className="mt-1">Edit Blog Detail</span>
                              </Link>
                            </div>
                          ) : (
                            <div
                              className={`${styles["add-blog-detail-wrapper"]} d-flex justify-content-end align-items-center px-2 px-sm-5 py-2`}
                            >
                              <Link
                                to={`/dashboard/add-blog-details`}
                                state={{ blogId: blog.id }}
                              >
                                Add Blog Detail <GoPlus size={18} />
                              </Link>
                            </div>
                          )}
                          <div className="d-flex justify-content-end align-items-center px-5 py-3">
                            <div
                              onClick={() => handleUpdateBlog(blog)}
                              className="update-icon-wrapper"
                            >
                              <FaRegEdit />
                            </div>
                            <div
                              onClick={() => handleDeleteBlog(blog.blog_id)}
                              className="delete-icon-wrapper"
                            >
                              <FaTrashCan />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-center align-items-center text-center mt-4 mb-1">
                      {blogsData.length > 6 && (
                        <>
                          {displayedBlogsCount < blogsData.length ? (
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

export default ManageBlogs;
