import { Link } from 'react-router';
import { images } from "../../constants/AssetsContainer";

const Footer = () => {
  return (
    // ======= footer section start =======
    <footer className="footer-section">
      <section className="footer-links-container d-none d-md-flex p-block-70 container">
        <section className="footer-logo-main-wrapper">
          <section className="footer-logo-wrapper mb-3">
            <Link to="/">
              <img src={images.enatLogoSM} alt="footer-logo" />
            </Link>
          </section>
          <section className="slogan-content">
            <h4>Where Care Meets Compassion—Like a Mother's Embrace.</h4>
          </section>
        </section>
        <section className="links-item">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/">About</Link>
            </li>
            <li>
              <Link to="/">Services</Link>
            </li>
            <li>
              <Link to="/">Doctors</Link>
            </li>
          </ul>
        </section>
        <section className="links-item">
          <h4>Why Choose Us</h4>
          <ul>
            <li>
              <a href="#">Compassionate Care</a>
            </li>
            <li>
              <a href="#">Comprehensive Services</a>
            </li>
            <li>
              <a href="#">Patient-Centric Approach</a>
            </li>
            <li>
              <a href="#">Community Engagement</a>
            </li>
          </ul>
        </section>
        <section className="links-item">
          <h4>Contact Info</h4>
          <ul>
            <li>
              <a href="#">Email: info@enathealthcare.com</a>
            </li>
            <li>
              <a href="#">Phone: 09 11 45 67 89</a>
            </li>
            <li>
              <a href="#">website: enathealthcare.com</a>
            </li>
            <li>
              <a href="#">Address: Bole friendship</a>
            </li>
          </ul>
        </section>
      </section>
      {/*  mobile device footer section  */}
      <section className="d-md-none md-footer-links-wrapper container">
        <div className="accordion accordion-flush" id="accordionFlushId">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                <section className="footer-logo-wrapper mb-3">
                  <a href="#">
                    <img src={images.enatLogoSM} alt="footer-logo" />
                  </a>
                </section>
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushId"
            >
              <div className="accordion-body">
                <section className="slogan-content">
                  <h4>Where Care Meets Compassion—Like a Mother's Embrace.</h4>
                </section>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="false"
                aria-controls="flush-collapseTwo"
              >
                <h4>Quick Links</h4>
              </button>
            </h2>
            <div
              id="flush-collapseTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushId"
            >
              <div className="accordion-body">
                <section className="links-item">
                  <ul>
                    <li>
                      <a href="#">Home</a>
                    </li>
                    <li>
                      <a href="#">About</a>
                    </li>
                    <li>
                      <a href="#">Services</a>
                    </li>
                    <li>
                      <a href="#">Doctors</a>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseThree"
                aria-expanded="false"
                aria-controls="flush-collapseThree"
              >
                <h4>Why Choose Us</h4>
              </button>
            </h2>
            <div
              id="flush-collapseThree"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushId"
            >
              <div className="accordion-body">
                <section className="links-item">
                  <ul>
                    <li>
                      <a href="#">Compassionate Care</a>
                    </li>
                    <li>
                      <a href="#">Comprehensive Services</a>
                    </li>
                    <li>
                      <a href="#">Patient-Centric Approach</a>
                    </li>
                    <li>
                      <a href="#">Community Engagement</a>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseFour"
                aria-expanded="false"
                aria-controls="flush-collapseFour"
              >
                <h4>Contact Info</h4>
              </button>
            </h2>
            <div
              id="flush-collapseFour"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushId"
            >
              <div className="accordion-body">
                <section className="links-item">
                  <ul>
                    <li>
                      <a href="#">Email: info@enathealthcare.com</a>
                    </li>
                    <li>
                      <a href="#">Phone: 09 11 45 67 89</a>
                    </li>
                    <li>
                      <a href="#">website: enathealthcare.com</a>
                    </li>
                    <li>
                      <a href="#">Address: Bole friendship</a>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="sub-footer-links-container">
        <section className="sub-footer-links-item">
          <section className="copy-right">
            <p>
              Copyright &copy; 2025 Enat Health Care Solutions | All rights
              reserved.
            </p>
          </section>
          <section className="legal-links-wrapper">
            <ul>
              <li>
                <a href="">Privacy Policy</a>
              </li>
              <li>
                <a href="">Terms of Use</a>
              </li>
            </ul>
          </section>
          <ul className="social-media-link-lists">
            <li>
              <a href="#">
                <i className="fa-brands fa-facebook"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-brands fa-square-x-twitter"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-brands fa-tiktok"></i>
              </a>
            </li>
          </ul>
        </section>
      </section>
    </footer>
    // ======= footer section end =======
  );
}

export default Footer