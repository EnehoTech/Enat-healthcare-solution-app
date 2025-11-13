import { Routes, Route } from "react-router";
// import Header from "../components/Headers/Header/Header";
// import Footer from "../components/Footer/Footer";
import Home from "../pages/Home/Home";
import NotFoundPage from "../pages/4O4/NotFoundPage";
import UsersProfile from "../components/UsersProfile/UsersProfile";
import SingleUserProfile from "../components/UsersProfile/SingleUserProfile";
import MainLayout from "../layouts/MainLayout/MainLayout";
import BlogsPage from "../pages/BlogsPage/BlogsPage";
import DashboardLayout from "../layouts/MainLayout/DashboardLayout/DashboardLayout";
import SignIn from "../features/auth/pages/SignIn/SignIn";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard/AdminDashboard";
import AddEmployee from "../features/dashboard/pages/AddEmployee/AddEmployee";
const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/contact" element={<h1>Contact Page</h1>} />
          <Route path="/services" element={<h1>Services Page</h1>} />
          <Route path="/departments" element={<h1>Departments Page</h1>} />
          <Route path="/doctors" element={<h1>Doctors Page</h1>} />
          <Route path="/appointment" element={<h1>Appointment Page</h1>} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/user-profile" element={<UsersProfile />}>
            <Route path=":userId" element={<SingleUserProfile />} />
          </Route>
          {/* auth routes */}
          <Route path="/sign-in" element={<SignIn />} />
          {/* 404 not found routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* admin dashboard routes*/}
        <Route element={<DashboardLayout />}>
          {/* main admin dashboard routes*/}
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard/sign-up" element={<AddEmployee />} />
        </Route>
        {/* 404 not found routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
