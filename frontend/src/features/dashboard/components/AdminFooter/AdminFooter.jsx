import styles from "./AdminFooter.module.css";

const AdminFooter = () => {
  return (
    <footer id="footer" className={`${styles["footer"]} bg-light`}>
      <div className={`${styles["copyright"]}`}>
        <p>
          Copyright &copy;&nbsp;{new Date().getFullYear()} Enat Healthcare. All
          rights reserved.
        </p>
      </div>
      <div className={`${styles["credits"]}`}>
        <span>
          Proudly powered by &nbsp;
          <a to="/#" target="_blank">
            Eneho Tech.
          </a>
        </span>
      </div>
    </footer>
  );
};

export default AdminFooter;
