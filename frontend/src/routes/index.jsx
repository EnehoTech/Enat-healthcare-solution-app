import { Routes, Route } from "react-router";
// import Header from "../components/Headers/Header/Header";
// import Footer from "../components/Footer/Footer";
import Home from "../pages/Home/Home";
import NotFoundPage from "../pages/4O4/NotFoundPage";
import UsersProfile from "../components/UsersProfile/UsersProfile";
import SingleUserProfile from "../components/UsersProfile/SingleUserProfile";
import Layout from "../layouts/Layout/Layout";
const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/contact" element={<h1>Contact Page</h1>} />
          <Route path="/services" element={<h1>Services Page</h1>} />
          <Route path="/departments" element={<h1>Departments Page</h1>} />
          <Route path="/doctors" element={<h1>Doctors Page</h1>} />
          <Route path="/appointment" element={<h1>Appointment Page</h1>} />
          <Route path="/user-profile" element={<UsersProfile />}>
            <Route path=":userId" element={<SingleUserProfile />} />
          </Route>

          {/* 404 not found routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
