import styles from "./PreLoader.module.css";

const PreLoader = () => {
  return (
    <section
      className={`${styles["preloader-wrapper"]}  d-flex align-items-center justify-content-center`}
    >
      <div className={styles["preloader-item"]}></div>
    </section>
  );
};

export default PreLoader;
