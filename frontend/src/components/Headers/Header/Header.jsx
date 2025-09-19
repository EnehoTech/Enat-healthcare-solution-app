import TopHeader from "../TopHeader/TopHeader";
import mainLogo from "../../../assets/images/logo/ehcs-logo.png";
import logoSM from "../../../assets/images/logo/logo-icon-2.png";

const Header = () => {
  return (
    <header id="header-section" className="header-section">
      <TopHeader />
      {/* ======= main header section start =======  */}
      <section className="main-header">
        <section className="main-header-container">
          <section className="logo-wrapper">
            <a href="index.html">
              <img src={mainLogo} alt="enat-health-care-solutions-logo" />
            </a>
          </section>

          <section className="logo-sm-wrapper">
            <a href="index.html">
              <img src={logoSM} alt="enat-health-care-solutions-logo-sm" />
            </a>
          </section>

          <section id="nav-bar" className="nav-bar">
            <ul className="nav-items">
              <li>
                <a href="#hero">Home</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#departments">Departments</a>
              </li>
              <li>
                <a href="#doctors">Doctors</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
              <li>
                <a className="main-btn" href="index.html#appointment">
                  Make an Appointment
                </a>
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
