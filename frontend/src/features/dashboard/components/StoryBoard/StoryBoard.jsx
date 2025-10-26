import { Link } from "react-router";
import styles from "./StoryBoard.module.css";
import { MdChevronRight } from "react-icons/md";

const StoryBoard = ({ title, subtitle, btnText, btnPath, bgImage }) => {
  return (
    <section
      className={styles["story-board-section"]}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {btnText && btnPath && (
            <div className="col-lg-12 align-self-center">
              <Link
                className={`${styles["story-board-section-btn"]} text-right`}
                to={btnPath}
              >
                {btnText} <MdChevronRight />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StoryBoard;
