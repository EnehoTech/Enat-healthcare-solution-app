import { IoNotificationsCircleSharp } from "react-icons/io5";
import { Link } from "react-router";
import { AiOutlineUsergroupAdd } from "react-icons/ai";


const NavNotifications = () => {


  return (
    <>
      <div className="nav-item dropdown ms-2 me-2">
        <a className="nav-link" href="" data-bs-toggle="dropdown">
          <IoNotificationsCircleSharp className="notification-icon" />
          <div className="badge bg-primary badge-number">3</div>
        </a>
        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications ">
          <li className="dropdown-header ">
            You have &nbsp;
            <span>3</span>
            &nbsp; new notifications
          </li>

          <li className="notification-item">
            <Link
              to="/dashboard/requested-membership"
              className="notification-link"
            >
              <AiOutlineUsergroupAdd className="notification-item-icon" />
              <div>
                <h4>Received Notification 1 </h4>
                <p>
                  Total notification :&nbsp;
                  <span>3</span>
                </p>
              </div>
            </Link>
          </li>
          <li className="notification-item">
            <Link
              to="/dashboard/requested-membership"
              className="notification-link"
            >
              <AiOutlineUsergroupAdd className="notification-item-icon" />
              <div>
                <h4>Received Notification 2 </h4>
                <p>
                  Total notification :&nbsp;
                  <span>3</span>
                </p>
              </div>
            </Link>
          </li>
          <li className="notification-item">
            <Link
              to="/dashboard/requested-membership"
              className="notification-link"
            >
              <AiOutlineUsergroupAdd className="notification-item-icon" />
              <div>
                <h4>Received Notification 3 </h4>
                <p>
                  Total notification :&nbsp;
                  <span>3</span>
                </p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default NavNotifications;
