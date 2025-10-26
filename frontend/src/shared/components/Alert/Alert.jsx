import styles from "./Alert.module.css";
const Alert = ({ alertBg, message, alertClass, messageColor }) => {
  return (
    <div
      className={`${styles["error-alert"]} ${alertBg} ${alertClass}  alert  d-flex align-items-center justify-content-between"
   `}
      role="alert"
    >
      <div className={`${messageColor} px-1`}>{message}</div>
    </div>
  );
};

export default Alert;
