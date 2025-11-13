import { FaUsers } from "react-icons/fa";
import styles from "./MetricsCard.module.css";
const MetricsCard = ({ cardItem }) => {
  return (
    <div className={`${styles["dashboard-card"]} col-md-6`}>
      <div
        className={`card ${styles["info-card"]} ${styles["app-statistics-card"]}  `}
      >
        <div className="d-flex justify-content-between ">
          <h5 className="card-title inf-card-title">{cardItem.name}</h5>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center mt-2 gap-3">
            <div
              className={`${styles["card-icon"]} rounded-circle d-flex align-items-center justify-content-center`}
            >
              <FaUsers />
            </div>
            <div>
              <h6>{cardItem?.total}</h6>
              <span
                className={`${
                  cardItem.percentage > 0 ? "text-success" : "text-danger"
                } small pt-1 fw-bold`}
              >
                {cardItem.percentage &&
                  `${(cardItem.percentage * 100).toFixed(2)}%`}
              </span>
              <span className={`${styles["percentage-desc"]} small pt-2`}>
                {cardItem.percentage !== null
                  ? " Of Total Users"
                  : " Total Users"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
