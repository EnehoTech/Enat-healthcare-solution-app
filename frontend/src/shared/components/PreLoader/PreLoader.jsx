import styles from "./PreLoader.module.css";

const PreLoader = () => {
  return (
    <section
      className={`${styles["preloader-wrapper"]}  d-flex align-items-center justify-content-center`}
    >
      <div
        className={`${styles["preloader"]}`}
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div className={styles["preloader-item"]}></div>
        <div className={styles["preloader-item"]}></div>
        <div className={styles["preloader-item"]}></div>
        <div className={styles["preloader-item"]}></div>
        <div className={styles["preloader-item"]}></div>
        <div className={styles["preloader-item"]}></div>
        <div className={styles["preloader-item"]}></div>
        <div className={styles["preloader-item"]}></div>
        <div className={styles["preloader-item"]}></div>
        <div className={styles["preloader-item"]}></div>
        <div className={styles["preloader-item"]}></div>
        <div className={styles["preloader-item"]}></div>
      </div>
    </section>
  );
};

export default PreLoader;
