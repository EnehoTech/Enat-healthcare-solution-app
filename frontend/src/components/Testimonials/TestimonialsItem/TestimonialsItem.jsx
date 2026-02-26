import styles from "../Testimonials.module.css";
import { TbBlockquote } from "react-icons/tb";
import { BiSolidQuoteLeft, BiSolidQuoteRight } from "react-icons/bi";

// Api Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TestimonialsItem = ({
  testimonialText,
  testifierAvatar,
  fullName,
  jobTitle,
  bgColor,
}) => {
  return (
    <div className={`${styles["testimonials-item"]}`}>
      <div className="d-flex flex-column flex-sm-row justify-content-sm-between gap-4">
        <div className="d-flex flex-column justify-content-between ">
          {testifierAvatar ? (
            <div className={`${styles["avatar"]}`}>
              <img
                src={`${API_BASE_URL}${testifierAvatar}`}
                alt="testifier avatar"
                crossOrigin="anonymous"
                loading="lazy"
                width="64"
                height="64"
              />
            </div>
          ) : (
            <div className={`${styles["avatar"]} `}>
              <div
                className={`${styles["no-avatar-wrapper"]}`}
                style={{
                  backgroundColor: `${bgColor}`,
                }}
              >
                {`${fullName?.split(" ")[0]?.charAt(0).toUpperCase() || ""}${
                  fullName?.split(" ")[1]?.charAt(0).toUpperCase() || ""
                }`}
              </div>
            </div>
          )}
          <div className={`${styles["grid-pattern-bg"]} flex-grow-1`}> &nbsp; </div>
        </div>
        <div className="d-flex flex-column justify-content-between ">
          <p>
            <sup className="me-2">
              <BiSolidQuoteLeft
                className={`${styles["testimonial-sup-icon"]}`}
              />
            </sup>

            {testimonialText}
            <sup className="ms-2">
              <BiSolidQuoteRight
                className={`${styles["testimonial-sup-icon"]}`}
              />
            </sup>
          </p>
          <div
            className={`d-flex align-items-center  ${styles["testimonial-provider-info"]}`}
          >
            <div className={`${styles["personal-profile"]}`}>
              <h3>{fullName}</h3>
              <span>{jobTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsItem;
