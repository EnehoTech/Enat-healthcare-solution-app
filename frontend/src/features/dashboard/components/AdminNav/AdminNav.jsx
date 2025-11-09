import "./AdminNav.css";
import NavMessage from "./NavMessage";
import NavNotifications from "./NavNotifications";
import AdminUserProfile from "./AdminUserProfile";

const AdminNav = () => {

  return (
    <nav className="admin-header-nav ms-auto">
      <ul className="d-flex align-items-center ">
        {<NavNotifications />}
        {<NavMessage />}
        <AdminUserProfile />
      </ul>
    </nav>
  );
};

export default AdminNav;
