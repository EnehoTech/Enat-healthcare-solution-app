const TopHeader = () => {
  return (
    //  <!-- ======= top header bar start ======= -->
    <section className="top-header">
      <section className="top-header-container">
        <section className="top-header-left">
          <section className="call-us-now">
            <i className="fa-solid fa-phone-volume"></i> Call us now
            +251911234567
          </section>
          <section className="working-days">
            <i className="fa-solid fa-clock"></i> MON - SAT, 8AM to 10PM
          </section>
        </section>
        <section className="social-media-links-wrapper">
          <p className="help">
            <a href="#">Help?</a>
          </p>
          <ul>
            <li>
              <a href="##">
                <i className="fa-brands fa-facebook"></i>
              </a>
            </li>
            <li>
              <a href="##">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </li>
            <li>
              <a href="##">
                <i className="fa-brands fa-square-x-twitter"></i>
              </a>
            </li>
            <li>
              <a href="##">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </li>
            <li>
              <a href="##">
                <i className="fa-brands fa-tiktok"></i>
              </a>
            </li>
          </ul>
        </section>
      </section>
    </section>
    // <!-- ======= top header bar end ======= -->
  );
};

export default TopHeader;
