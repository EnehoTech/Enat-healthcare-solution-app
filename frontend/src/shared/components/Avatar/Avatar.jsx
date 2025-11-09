// import css module
import styles from "./Avatar.module.css";
// import link from react router dom
import { Link } from "react-router";
// Base URL for the API, imported from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Avatar = ({
  avatar,
  altText,
  firstName,
  lastName,
  userName,
  bgColor,
  isAnchorLink = true,
  userId,
}) => {
  return (
    <div className={styles["avatar-wrapper"]}>
      {avatar ? (
        <div className={styles["avatar-icon-wrapper"]}>
          {isAnchorLink ? (
            <Link
              to={`/user-profile?u=${userName}&u_id=${userId}`}
              target="_blank"
            >
              <img
                src={`${API_BASE_URL}${avatar}`}
                alt={altText}
                className={styles["avatar-icon"]}
                crossOrigin="anonymous"
                loading="lazy"
                width="60"
                height="60"
              />
            </Link>
          ) : (
            <img
              src={`${API_BASE_URL}${avatar}`}
              alt={altText}
              className={styles["avatar-icon"]}
              crossOrigin="anonymous"
              loading="lazy"
              width="60"
              height="60"
            />
          )}
        </div>
      ) : isAnchorLink ? (
        <Link to={`/user-profile?u=${userName}&u_id=${userId}`} target="_blank">
          <div
            className={styles["no-avatar-wrapper"]}
            style={{
              backgroundColor: `${bgColor}`,
            }}
          >
            {`${firstName?.charAt(0)}${lastName?.charAt(0)}`}
          </div>
        </Link>
      ) : (
        <div
          className={styles["no-avatar-wrapper"]}
          style={{
            backgroundColor: `${bgColor}`,
          }}
        >
          {`${firstName?.charAt(0)}${lastName?.charAt(0)}`}
        </div>
      )}
    </div>
  );
};

export default Avatar;
