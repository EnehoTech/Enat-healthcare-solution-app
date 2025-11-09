import { MdMessage } from "react-icons/md";
import { Link } from "react-router";

const NavMessage = () => {
  return (
    <>
      <li className="nav-item dropdown ms-2 me-2">
        <a className="nav-link" href="" data-bs-toggle="dropdown">
          <MdMessage className="message-icon" />
          <span className="badge message-badge-bg badge-number">3</span>
        </a>
        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages ">
          <li className="dropdown-header">
            You have received <span> 3 </span> new appointments
          </li>
          <li className="message-item">
            <Link to="/dashboard/appointments">
              <div>
                <h4>Abekyelesh Yimer</h4>
                <p>AbekLess@gmail.com</p>
                <section className="pt-1">
                  <p>
                    <strong>Case Description: </strong>{" "}
                    <span> Lorem ipsum dolor sit amet consectetur.</span>
                  </p>
                  <p>
                    <strong> Received: </strong>Nov 08, 2025 || 2 hrs. ago
                  </p>
                </section>
              </div>
            </Link>
          </li>
          <li className="message-item">
            <Link to="/dashboard/appointments">
              <div>
                <h4>Abemilik Solomon </h4>
                <p>Abemlk@gmail.com</p>
                <section className="pt-1">
                  <p>
                    <strong>Case Description: </strong>{" "}
                    <span> Lorem ipsum dolor sit amet consectetur.</span>
                  </p>
                  <p>
                    <strong> Received: </strong>Nov 08, 2025 || 2 hrs. ago.
                  </p>
                </section>
              </div>
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};

export default NavMessage;
