import { useState, useEffect } from "react";
import { Link } from "react-router";
import { FaCalendarAlt } from "react-icons/fa";
import { MdChevronRight } from "react-icons/md";
import { TbUserCircle } from "react-icons/tb";
import styles from "./Blogs.module.css";
import SectionTitle from "../SectionTitle/SectionTitle";
import Alert from "../../shared/components/Alert/Alert";
import { getAllBlogs } from "../../services/public.service";
import PreLoader from "../../shared/components/PreLoader/PreLoader";
import { formatDateWithMonthName } from "../../utils/formatDate";
import handleError from "../../utils/handleError";
import SectionBanner from "../../shared/components/SectionBanner/SectionBanner";

const Blogs = ({ show }) => {
  const [blogsData, setBlogsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);
  // State that hold blogs displayed
  const [displayedBlogsCount, setDisplayedBlogsCount] = useState(6);

  // Fetch all blogs
  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const fetchAllBlogs = async () => {
    try {
      setIsLoading(true);
      setApiErrors(null);
      const response = await getAllBlogs();
      if (response.success === true) {
        setBlogsData(
          show ? response.data.blogs : response.data.blogs?.slice(0, 3) || []
        );
      }
    } catch (error) {
      setApiErrors(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  //   handle show More
  const handleShowMore = () => {
    setDisplayedBlogsCount(blogsData.length); // Show all blogs
  };
  //   handle show Less
  const handleShowLess = () => {
    setDisplayedBlogsCount(6); // Reset to showing only 6 blogs
  };
  // Truncate the description if it exceeds the limit
  const truncateDescription = (description, limit = 120) => {
    return description.length > limit
      ? `${description.slice(0, limit)}...`
      : description;
  };

  return (
    <>
      {show && (
        <SectionBanner
          title="All Blog posts"
          subtitle="Blog posts"
          sectionBannerBg="enat-blog-post-banner-bg"
        />
      )}
      {blogsData.length > 0 && (
        <div className={` bg-light ${styles["blog-section"]} p-block-70`}>
          <div className="container">
            <SectionTitle
              title="Blogs"
              description="Discover latest articles about your health and wellness."
            />
            {apiErrors && (
              <Alert
                message={apiErrors}
                alertBg="bg-red-25"
                alertClass="alert-danger"
                messageColor="text-danger"
              />
            )}
            <div className="row">
              {isLoading ? (
                <PreLoader />
              ) : (
                blogsData?.slice(0, displayedBlogsCount)?.map((blog) => (
                  <div className="col-lg-4 col-md-6 mb-4" key={blog.blog_id}>
                    <div
                      className={`d-flex flex-column justify-content-between ${styles["single-post-item"]} ${styles["blog-post"]}`}
                    >
                      <div className={`${styles["post-thumbnail"]}`}>
                        <Link to={`/blog-detail?bh=${"#"}`}>
                          <img
                            src={`${blog.blog_img}`}
                            alt="blog post thumbnail"
                            crossOrigin="anonymous"
                            loading="lazy"
                            width="860"
                            height="250"
                          />
                        </Link>
                      </div>
                      <div
                        className={`d-flex flex-column justify-content-between flex-grow-1 ${styles["post-content"]}`}
                      >
                        <div>
                          <ul
                            className={`d-flex align-items-sm-center ${styles["posted-content-info"]}`}
                          >
                            <li className="d-flex align-items-center gap-1">
                              <TbUserCircle size={24} />
                              <span className={`${styles["blogger"]}`}>
                                {blog?.user?.display_name}
                              </span>
                            </li>
                            <li className="d-flex align-items-center gap-1 ps-2 ps-sm-0">
                              <FaCalendarAlt />
                              <span>
                                {blog.updated_at &&
                                  formatDateWithMonthName(blog.updated_at)}
                              </span>
                            </li>
                          </ul>
                          <h3>
                            <Link to={`/blog-detail?bh=${"#"}`}>
                              {blog.blog_title}
                            </Link>
                          </h3>
                          <p> {truncateDescription(blog.blog_description)}</p>
                        </div>
                        <div
                          className={`d-flex justify-content-between pt-4 ${styles["blog-btn-wrapper"]}`}
                        >
                          <Link
                            to={`/blog-detail?bh=${"#"}`}
                            className={`${styles["link-btn"]}`}
                          >
                            Read Full Article <MdChevronRight />
                          </Link>
                          {!show && (
                            <Link
                              to="/blogs"
                              className={`${styles["link-btn"]}`}
                            >
                              View All Blogs <MdChevronRight />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="d-flex justify-content-center align-items-center text-center mt-4 mb-1">
              {blogsData.length > 6 && (
                <>
                  {displayedBlogsCount < blogsData.length ? (
                    <button
                      className={`${styles["main-btn"]}`}
                      onClick={handleShowMore}
                    >
                      Show More Blogs
                    </button>
                  ) : (
                    <button
                      className={`${styles["main-btn"]}`}
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
      )}
    </>
  );
};

export default Blogs;