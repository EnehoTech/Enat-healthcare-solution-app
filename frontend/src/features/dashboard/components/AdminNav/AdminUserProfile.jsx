import {
  MdCoPresent,
  MdDashboard,
  MdOfflinePin,
  MdOutlineHelp,
} from "react-icons/md";
import { PiSignOut } from "react-icons/pi";
import { Link, Navigate } from "react-router";
import MiniAvatar from "../../../../shared/components/Avatar/MiniAvatar/MiniAvatar";
import Avatar from "../../../../shared/components/Avatar/Avatar";



const AdminUserProfile = () => {

  const handleSignOut = async () => {
    try {
      // Call signOutService to handle token removal
      await signOutService();

      // Dispatch the signOut action to update global state
      // dispatch(signOut());
      // dispatch(resetOnboardingStage());

      // Redirect user to the home page or another appropriate route
      Navigate("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };




  return (
    <>

        <li className="nav-item dropdown ms-2 me-2">
          <a
            className="nav-link nav-profile d-flex align-items-center pe-0"
            href=""
            data-bs-toggle="dropdown"
          >
            <div className="mini-avatar-outer-wrapper">
              <MiniAvatar
                avatar=""
                altText="avatar"
                firstName="Abekyelesh"
                lastName="Yimer"
                bgColor="#8679F8"
                isAnchorLink={false}
              />
            </div>
            <div className="admin-profile-avatar-wrapper ps-2">
              <div className="d-none d-md-block dropdown-toggle ">
                Abekyelesh Yimer
              </div>
              <span className="d-none d-md-block">_AY-013 </span>
            </div>
          </a>

          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow admin-profile-list-items">
            <li className="dropdown-item dropdown-1st-item d-flex flex-column flex-lg-row align-items-lg-center gap-1 gap-lg-3">
              <div className="d-flex flex-column gap-1">
                <div className="avatar-outer-wrapper">
                  <Avatar
                    avatar=""
                    altText="avatar"
                    firstName="Abekyelesh"
                    lastName="Yimer"
                    userName="_AY-013"
                    bgColor="#8679F8"
                    userId="1"
                  />
                </div>
                <div className="user-full-name">
                  <h6 className="mb-0">Abekyelesh Yimer</h6>
                </div>
              </div>

              <div className="key-user-info">
                <div>Email: abekless@gmail.com</div>
                <div>Phone: +251911010101</div>
                <div>User Name: _AY-013</div>
              </div>
            </li>

            <li className="dropdown-item">
              <div className="d-flex align-items-center gap-2">
                <MdOfflinePin className="admin-profile-icon" />
                <span>Role: Super Admin </span>
              </div>
            </li>
          
              <li>
                <Link
                  className="dropdown-item d-flex align-items-center gap-2"
                  to="/dashboard"
                >
                  <MdDashboard className="profile-list-icon" />
                  <span>Admin Dashboard</span>
                </Link>
              </li>
            

            <li>
              <Link
                className="dropdown-item d-flex align-items-center gap-2"
                to={`/user-profile?u=${"#"}&u_id=${"#"}`}
                target="_blank"
              >
                <MdCoPresent className="admin-profile-icon" />
                <span>my profile</span>
              </Link>
            </li>

            <li>
              <Link
                className="dropdown-item d-flex align-items-center gap-2"
                to="/contact"
              >
                <MdOutlineHelp className="admin-profile-icon" />
                <span>need help?</span>
              </Link>
            </li>
            <li>
              <div
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={handleSignOut}
              >
                <PiSignOut className="admin-profile-icon" />
                <span>sign out</span>
              </div>
            </li>
          </ul>
        </li>
    </>
  );
};

export default AdminUserProfile;
