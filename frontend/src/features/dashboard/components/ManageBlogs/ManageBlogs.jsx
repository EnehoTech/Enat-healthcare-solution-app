import  { useEffect, useRef, useState } from 'react'
import styles from "./ManageBlogs.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MdOutlineStorage } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { createBlog, deleteBlog, getAllBlogs, updateBlog } from '../../services/blog.service';
import { Slide, toast } from 'react-toastify';
import handleError from '../../../../utils/handleError';
import Alert from '../../../../shared/components/Alert/Alert';
import FormInput from '../../../../shared/components/FormInput/FormInput';
import PreLoader from '../../../../shared/components/PreLoader/PreLoader';
import { Link } from 'react-router';
import { TbUserCircle } from "react-icons/tb";
import { FaRegEdit } from "react-icons/fa";
import { FaCalendarDays, FaTrashCan } from "react-icons/fa6";
import { formatDateWithMonthName } from '../../../../utils/formatDate';
import { images } from '../../../../constants/AssetsContainer';
import StoryBoard from "../StoryBoard/StoryBoard";
// blog validation schema
const createBlogValidationSchema = (formMode) =>
  yup.object().shape({
    user_id:
      formMode === "create"
        ? yup
            .number()
            .typeError("User ID must be a number.")
            .integer("User ID must be an integer.")
            .positive("User ID must be positive.")
            .required("User ID is required.")
        : yup.number().nullable(),
    blog_img: yup
      .string()
      .required("Blog image path or URL is required.")
      .max(1024, "Image path is too long."),
    blog_title: yup
      .string()
      .required("Blog title is required.")
      .max(255, "Blog title must not exceed 255 characters."),
    blog_description: yup
      .string()
      .required("Blog description is required.")
      .max(10000, "Description is too long."),
  });
const ManageBlogs = () => {
  const [blogsData, setBlogsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);
  // const [isUpdateMode, setIsUpdateMode] = useState(false);
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

  // Truncate the description if it exceeds the limit
  const truncateDescription = (blog_description, limit = 144) => {
    return blog_description.length > limit
      ? `${blog_description.slice(0, limit)}...`
      : blog_description;
  };

  // Fetch all blogs
  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const fetchAllBlogs = async () => {
    try {
      setIsLoading(true);
      setApiErrors(null);
      const response = await getAllBlogs();
      if (response.success === true || response.success === "true") {
        setBlogsData(response.data?.blogs || []);
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
        ...(formMode === "create" ? { user_id: Number(data.user_id) } : {}),
        blog_img: data.blog_img,
        blog_title: data.blog_title,
        blog_description: data.blog_description,
      };

      if (formMode === "update" && selectedBlogId) {
        const response = await updateBlog(selectedBlogId, payload);

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
        const response = await createBlog(payload);

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
    setSelectedBlogId(blog.blog_id);

    setValue("user_id", blog.user_id); // harmless for update; schema ignores if not create
    setValue("blog_img", blog.blog_img || "");
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
      const response = await deleteBlog(blogId);
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
    <main id="main" className="my-5">
      <section className="container-fluid px-4 dashboard dashboard-section">
        <div className="row">
          <div className="col-lg-8">
            <div className="col-12">
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
                            Add Blog Posts
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
                              {formMode === "create" && (
                                <div className="col-lg-12 col-md-12">
                                  <FormInput
                                    label="User Id"
                                    type="number"
                                    name="user_id"
                                    placeholder="Enter User Id"
                                    register={register}
                                    onInputChange={handleInputChange}
                                    error={errors.user_id}
                                  />
                                </div>
                              )}
                              <div className="col-lg-12 col-md-12">
                                <FormInput
                                  label="Blog Img"
                                  type="text"
                                  name="blog_img"
                                  placeholder="Enter blog image url"
                                  register={register}
                                  onInputChange={handleInputChange}
                                  error={errors.blog_img}
                                />
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
                    {/* <DashboardCardEllipsis /> */}
                  </div>
                  <div className="card-body">
                    <div className="news">
                      {blogsData?.slice(0, displayedBlogsCount)?.map((blog) => (
                        <div
                          key={blog.blog_id}
                          className="post-item clearfix border-bottom"
                        >
                          <div className="d-flex flex-column flex-sm-row align-items-sm-center">
                            <div className="align-self-start mt-0 mt-sm-2 mb-3 mb-sm-0">
                              <div className="blog-image-wrapper">
                                <Link to={`/blog-detail?bh=${"#"}`}>
                                  <img
                                    src={blog?.blog_img}
                                    alt="blog banner"
                                    crossOrigin="anonymous"
                                    loading="lazy"
                                  />
                                </Link>
                              </div>
                            </div>
                            <div className="blog-content-title ps-0 ps-sm-3">
                              <h4>
                                <Link to={`/blog-detail?bh=${"#"}`}>
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
                                    {blog?.user?.display_name}{" "}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <FaCalendarDays className="blog-icon" />
                                  <div>
                                    <span className="ps-2">
                                      {blog.updated_at &&
                                        formatDateWithMonthName(
                                          blog.updated_at
                                        )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="blog-content-desc mt-2">
                            <p>{truncateDescription(blog.blog_description)}</p>
                          </div>
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
}

export default ManageBlogs