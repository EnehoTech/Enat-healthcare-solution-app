import { useEffect, useRef } from "react";
import TopHeader from "../TopHeader/TopHeader";
import { Link } from "react-router";
import { images } from "../../../constants/AssetsContainer";
import { useSelector } from "react-redux";

const Header = () => {
  // destructure user data from global state
  const { isAuth } = useSelector((state) => state?.auth);
  const offcanvasRef = useRef(null);

  const offcanvasInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize Bootstrap Offcanvas instance once
    if (offcanvasRef.current && window.bootstrap?.Offcanvas) {
      offcanvasInstanceRef.current =
        window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasRef.current);
    }

    const handleResize = () => {
      if (window.innerWidth >= 992 && offcanvasInstanceRef.current) {
        // Properly hide offcanvas via Bootstrap API
        offcanvasInstanceRef.current.hide();
      }
    };

    window.addEventListener("resize", handleResize);

    // Run once on mount in case we load on large screen
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <header id="header-section" className="header-section">
      <TopHeader />
      {/* ======= main header section start =======  */}
      <section className="main-header">
        <section className="main-header-container">
          <section className="logo-wrapper">
            <Link to="/">
              <img
                src={images.enatLogo}
                alt="enat-health-care-solutions-logo"
              />
            </Link>
          </section>

          <section className="logo-sm-wrapper">
            <Link to="/">
              <img
                src={images.enatLogoSM}
                alt="enat-health-care-solutions-logo-sm"
              />
            </Link>
          </section>

          <section id="nav-bar" className="nav-bar">
            <ul className="nav-items">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/departments">Departments</Link>
              </li>
              <li>
                <Link to="/doctors">Doctors</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              {isAuth ? (
                <li>
                  <Link className="main-btn-light" to="/dashboard">
                    Admin Dashboard
                  </Link>
                </li>
              ) : (
                <li>
                  <Link className="main-btn-light" to="/sign-in">
                    Sign In
                  </Link>
                </li>
              )}

              <li>
                <Link className="main-btn" to="/appointments">
                  Make an Appointment
                </Link>
              </li>
            </ul>
          </section>
          {/* ======= hamburger menu section =======  */}
          <section className="hamburger-menu">
            {/* <i className="fa-solid fa-bars"></i> */}
            <button
              className="hamburger-btn"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </section>

          <section
            ref={offcanvasRef}
            className="offcanvas offcanvas-start mobil-header-container"
            tabIndex="-1"
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header offcanvas-logo-wrapper">
              <section id="offcanvasRightLabel" className="logo-wrapper">
                <Link to="/">
                  <img
                    src={images.enatLogo}
                    alt="enat-health-care-solutions-logo"
                  />
                </Link>
              </section>
              <section id="offcanvasRightLabel" className="logo-sm-wrapper">
                <Link to="/">
                  <img
                    src={images.enatLogoSM}
                    alt="enat-health-care-solutions-logo-sm"
                  />
                </Link>
              </section>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <nav className="mobile-nav-bar">
                <ul className="mobile-nav-items list-unstyled d-flex flex-column">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                  <li>
                    <Link to="/services">Services</Link>
                  </li>
                  <li>
                    <Link to="/departments">Departments</Link>
                  </li>
                  <li>
                    <Link to="/doctors">Doctors</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                  {isAuth ? (
                    <li>
                      <Link className="main-btn-light" to="/dashboard">
                        Admin Dashboard
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link className="main-btn-light" to="/sign-in">
                        Sign In
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="main-btn" to="/appointment">
                      Make an Appointment
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </section>
        </section>
      </section>
      {/* ======= main header section end =======  */}
    </header>
  );
};

export default Header;
