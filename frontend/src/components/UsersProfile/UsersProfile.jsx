import {NavLink, Outlet } from "react-router";

const UsersProfile = () => {
  const users = [
    { id: 1, fullName: "Alex Johnson" },
    { id: 2, fullName: "Michael Smith" },
    { id: 3, fullName: "Emily Davis" },
    { id: 4, fullName: "David Brown" },
    { id: 5, fullName: "Sarah Wilson" },
    { id: 6, fullName: "James Taylor" },
    { id: 7, fullName: "Jessica Lee" },
  ];
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-6">
          <h2>User Profile Component </h2>
          <ul className="list-unstyled ">
            {users?.map((user) => (
              <li className="py-2" key={user.id}>
                <NavLink
                  to={`/user-profile/${user.id}`}
                  className={({ isActive }) =>
                    isActive ? "text-warning fw-bold" : ""
                  }
                >
                  {user.fullName}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UsersProfile;
