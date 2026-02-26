import {  useEffect, useState } from "react";
import {  useSearchParams } from "react-router";
// styles
import styles from "./BlogDetail.module.css";
// Icons & UI
import { TbUserCircle } from "react-icons/tb";
import { FaCalendarAlt } from "react-icons/fa";
// shared components
import SectionBanner from "../../../shared/components/SectionBanner/SectionBanner";
import Alert from "../../../shared/components/Alert/Alert";
import PreLoader from "../../../shared/components/PreLoader/PreLoader";
// config & utils
import handleError from "../../../utils/handleError";
import { formatDateWithMonthName } from "../../../utils/formatDate";
// API services
import { getBlogDetailByHashService } from "../../../services/public.service";
// toast notifications

// Api Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to render paragraphs with <br /> tags
const renderDescription = (description) => {
  if (!description) return null;

  return description
    .split("\n") // Split by newlines
    .filter((paragraph) => paragraph.trim() !== "") // Remove empty paragraphs
    .map((paragraph, index) => <p key={index}>{paragraph}</p>);
};

const BlogDetail = () => {
  // data state
  const [blogDetail, setBlogDetail] = useState({});
  //   UI state
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);
  // Extract the 'blog detail hash bdh' from the  query parameter
  const [searchParams] = useSearchParams();
  const hash = searchParams.get("bdh");

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setIsLoading(true);
        setApiErrors(null);
        const response = await getBlogDetailByHashService(hash);
        if (response.success === true || response.success === "true") {
          // Find the matching blog from the fetched data
          const singleBlogDetailData = response?.data?.blog_detail;

          if (!singleBlogDetailData) {
            setApiErrors("The blog you are looking for was not found.");
          }
          // Set the blog detail state
          setBlogDetail(singleBlogDetailData);
        } else {
          setApiErrors(response?.message || "Failed to fetch blogs.");
        }
      } catch (error) {
        setApiErrors(handleError(error));
        console.error("Error fetching blog detail:", error);
      } finally {
        setIsLoading(false); // Stop isLoading
      }
    };

    fetchBlogDetail();
  }, [hash]);
  return (
    <section className={styles["blog-detail-main-section"]}>
      <SectionBanner
        title="Blog Post Details"
        subtitle="Blog details"
        sectionBannerBg="enat-blog-post-banner-bg"
      />
      {/* blog detail section start */}
      <section className={`${styles["blog-detail-section"]} p-block-70`}>
        {apiErrors && (
          <div className="container">
            <Alert
              message={apiErrors}
              alertBg="bg-red-25"
              alertClass="alert-danger"
              messageColor="text-danger"
            />
          </div>
        )}
        {isLoading ? (
          <PreLoader />
        ) : (
          Object.keys(blogDetail).length > 0 && (
            <div className="container">
              <div className="row flex-column-reverse flex-lg-row">
                <div className="col-lg-8 posts-list">
                  <div className="single-post row">
                    <div className="col-lg-12">
                      {blogDetail?.blog?.image_url && (
                        <div className="blog-detail-post-img-banner">
                          <img
                            src={`${API_BASE_URL}${blogDetail?.blog?.image_url}`}
                            alt="blog image"
                            crossOrigin="anonymous"
                            loading="lazy"
                            height="350"
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-lg-3  col-md-3">
                      <div className="blog_info text-right">
                        {blogDetail?.user?.first_name && (
                          <ul className="blog_meta list">
                            <li>
                              <TbUserCircle
                                size={24}
                                color={
                                  blogDetail?.user?.user_color || "#15e4fd"
                                }
                              />{" "}
                              {blogDetail?.user?.first_name}{" "}
                              {blogDetail?.user?.last_name}
                            </li>
                            <li>
                              <FaCalendarAlt
                                color={
                                  blogDetail?.user?.user_color || "#15e4fd"
                                }
                              />{" "}
                              {blogDetail?.updated_at &&
                                formatDateWithMonthName(
                                  blogDetail.updated_at,
                                )}{" "}
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                    {blogDetail?.blog?.blog_title && (
                      <div className="col-lg-9 col-md-9 blog_details">
                        <h5>{blogDetail?.blog?.blog_title}</h5>
                        {renderDescription(blogDetail?.blog?.blog_description)}
                      </div>
                    )}

                    <div className="col-lg-12">
                      {blogDetail?.blog_main_highlight && (
                        <div className="quotes">
                          {blogDetail?.blog_main_highlight}
                        </div>
                      )}

                      <div className="row">
                        {blogDetail?.images?.length > 0 &&
                          blogDetail.images.slice(0, 2).map((img) => (
                            <div
                              className="blog-detail-post-img col-lg-6"
                              key={img.image_gallery_id}
                            >
                              <img
                                src={`${API_BASE_URL}${img.image_url}`}
                                alt={`blog image-${img.image_gallery_id}`}
                                crossOrigin="anonymous"
                                loading="lazy"
                                height="350"
                              />
                            </div>
                          ))}

                        <div className="col-lg-12 my-4">
                          {renderDescription(blogDetail?.detail_description)}
                        </div>
                        {blogDetail?.blog_post_wrap_up && (
                          <div className="col-lg-12 my-4">
                            <h6>let's wrap it up!</h6>
                            <p>{blogDetail?.blog_post_wrap_up}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 mb-4 mb-lg-0">
                  <div className="blog_right_sidebar">
                    {blogDetail?.user && (
                      <aside className="single_sidebar_widget author_widget">
                        <div className="d-flex justify-content-center">
                          <div
                            className={`${styles["author-avatar-wrapper"]} author-avatar-wrapper`}
                          >
                            {blogDetail?.user?.profile_picture ? (
                              <div className={`${styles["avatar"]} avatar`}>
                                <img
                                  src={`${API_BASE_URL}${blogDetail?.user?.profile_picture}`}
                                  alt={`avatar for ${blogDetail?.user?.first_name}`}
                                  crossOrigin="anonymous"
                                />
                              </div>
                            ) : (
                              <div className={`${styles["avatar"]} avatar`}>
                                <div
                                  className={`${styles["no-avatar-wrapper"]} no-avatar-wrapper`}
                                  style={{
                                    backgroundColor: `${blogDetail?.user?.user_color}`,
                                  }}
                                >
                                  {`${
                                    blogDetail?.user?.first_name
                                      ?.split(" ")[0]
                                      ?.charAt(0)
                                      .toUpperCase() || ""
                                  }${
                                    blogDetail?.user?.last_name
                                      ?.split(" ")[0]
                                      ?.charAt(0)
                                      .toUpperCase() || ""
                                  }`}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {blogDetail?.user?.first_name && (
                          <h5>
                            {" "}
                            {blogDetail?.user?.first_name}{" "}
                            {blogDetail?.user?.last_name}
                          </h5>
                        )}
                        {blogDetail?.blog?.blog_title && (
                          <p>{blogDetail?.blog?.blog_title}</p>
                        )}
                        <div className="br"></div>
                      </aside>
                    )}

                    {blogDetail?.related_blog_posts?.length > 0 && (
                      <aside className="single_sidebar_widget popular_post_widget">
                        <h4 className="widget_title">Popular Related Posts</h4>
                        <div className="row">
                          {blogDetail?.related_blog_posts?.map(
                            (relatedPost) => (
                              <div
                                className="media post_item"
                                key={relatedPost?.blog_id}
                              >
                                <Link
                                  to={`/blog-details?bdh=${relatedPost?.hash}`}
                                >
                                  <div className="related-post-img">
                                    <img
                                      src={`${API_BASE_URL}${relatedPost?.image_url}`}
                                      alt={`related post-${relatedPost?.blog_id} `}
                                    />
                                  </div>
                                </Link>

                                <div className="media-body">
                                  <Link
                                    to={`/blog-details?bdh=${relatedPost?.hash}`}
                                  >
                                    <h5>{relatedPost?.blog_title}</h5>
                                  </Link>
                                  {blogDetail?.updated_at && (
                                    <p>
                                      {formatDateWithMonthName(
                                        blogDetail.updated_at,
                                      )}{" "}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>

                        <div className="br"></div>
                      </aside>
                    )}

                    {blogDetail?.tags?.length > 0 && (
                      <aside className="single-sidebar-widget tag_cloud_widget">
                        <h4 className="widget_title"> Related Tags</h4>
                        <ul className="list">
                          {blogDetail?.tags?.map((tag) => (
                            <li key={tag.tag_id}>{tag.name}</li>
                          ))}
                        </ul>
                      </aside>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </section>
    </section>
  );
};

export default BlogDetail;
