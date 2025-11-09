import "./SideBar.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { PiSignOut } from "react-icons/pi";
import { Link } from "react-router";
import { signOutService } from "../../../auth/services/auth.service";

const SideBar = ({ sidebarConfig }) => {
  // user role fetch from state
  const userRole = 1; // user role
  // const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      // Call signOutService to handle token removal
      await signOutService();

      // Dispatch the signOut action to update global state
      // dispatch(signOut());
      // dispatch(resetOnboardingStage());

      // Redirect user to the home page or another appropriate route
      // navigate("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  // Check if the current role has access to an item or sub-item
  const hasRoleAccess = (roles) => roles.includes(userRole);
  return (
    <aside id="sidebar" className="sidebar border">
      <div className="d-flex flex-column justify-content-between gap-3 h-100 ">
        <ul id="sidebar-nav" className="sidebar-nav">
          {/* Main sidebar items */}
          {sidebarConfig
            .filter((item) => !item.items && hasRoleAccess(item.roles))
            .map((item) => (
              <li className="nav-item" key={item.label}>
                {item.label === "Home" || item.label === "Dashboard" ? (
                  <Link to={item.path} className="nav-link">
                    <div className="sidebar-icon-wrapper">{item.icon}</div>
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to={item.path}
                      className="nav-link collapsed"
                      data-bs-target={`#${item.label
                        .toLowerCase()
                        .replace(/\s+/g, "-")}-nav`}
                      data-bs-toggle="collapse"
                      aria-expanded="false"
                    >
                      <div className="sidebar-icon-wrapper">{item.icon}</div>
                      <span>{item.label}</span>
                      {item.subItems && (
                        <>
                          <IoIosArrowDown className="up-down-arrow-icon icon-collapsed" />
                          <IoIosArrowUp className="up-down-arrow-icon icon-expanded" />
                        </>
                      )}
                    </Link>
                    {item.subItems && (
                      <ul
                        id={`${item.label
                          .toLowerCase()
                          .replace(/\s+/g, "-")}-nav`}
                        className="nav-content collapse"
                        data-bs-parent="#sidebar-nav"
                      >
                        {item.subItems
                          .filter((subItem) =>
                            subItem.roles ? hasRoleAccess(subItem.roles) : true
                          )
                          ?.map((subItem) => (
                            <li key={subItem.label}>
                              <Link to={subItem.path}>
                                <span>{subItem.label}</span>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}

          {/* Pages Section */}
          {sidebarConfig?.some(
            (item) => item.label === "Pages" && hasRoleAccess(item.roles)
          ) && (
            <>
              <li className="nav-heading">Pages</li>
              {sidebarConfig
                .find((item) => item.label === "Pages")
                .items?.filter((page) => hasRoleAccess(page.roles))
                ?.map((page) =>
                  page?.pathToHomeSection ? (
                    <li className="nav-item" key={page._id}>
                      <Link to={page.path} className="nav-link">
                        <div className="sidebar-icon-wrapper">{page.icon}</div>
                        <span>{page.name}</span>
                      </Link>
                    </li>
                  ) : (
                    <li className="nav-item" key={page._id}>
                      <Link to={page.path} className="nav-link">
                        <div className="sidebar-icon-wrapper">{page.icon}</div>
                        <span>{page.name}</span>
                      </Link>
                    </li>
                  )
                )}
            </>
          )}
        </ul>

        {/* Sign Out */}
        <div className="sign-out-section mt-3 pt-2 border-top">
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={handleSignOut}>
              <div className="sidebar-icon-wrapper">
                <PiSignOut className="sidebar-icon" />
              </div>
              <span>Sign Out</span>
            </Link>
          </li>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
