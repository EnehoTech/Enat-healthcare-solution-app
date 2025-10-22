import TopHeader from "../TopHeader/TopHeader";
import mainLogo from "../../../assets/images/logo/ehcs-logo.png";
import logoSM from "../../../assets/images/logo/logo-icon-2.png";
import { Link } from "react-router";

const Header = () => {
  return (
    <header id="header-section" className="header-section">
      <TopHeader />
      {/* ======= main header section start =======  */}
      <section className="main-header">
        <section className="main-header-container">
          <section className="logo-wrapper">
            <Link to="/">
              <img src={mainLogo} alt="enat-health-care-solutions-logo" />
            </Link>
          </section>

          <section className="logo-sm-wrapper">
            <Link to="/">
              <img src={logoSM} alt="enat-health-care-solutions-logo-sm" />
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
              <li>
                <Link className="main-btn" to="/appointment">
                  Make an Appointment
                </Link>
              </li>
            </ul>
          </section>
          {/* ======= hamburger menu section =======  */}
          <section className="hamburger-menu">
            <i className="fa-solid fa-bars"></i>
          </section>
        </section>
      </section>
      {/* ======= main header section end =======  */}
    </header>
  );
};

export default Header;
