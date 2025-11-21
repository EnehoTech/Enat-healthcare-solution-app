// Import useSelector hook to access Redux state
import { useSelector } from "react-redux";
// Import Navigate from react-router-dom for handling redirects
import { Navigate } from "react-router";
import PreLoader from "../../shared/components/PreLoader/PreLoader";
import UnauthorizedPage from "../../pages/Unauthorized/UnauthorizedPage";


/**
 * ProtectedRoute component
 * This component is used to protect routes based on the user's authentication status and role.
 * It checks whether the user is authenticated and whether their role is included in the allowed roles for the route.
 *
 * @param {Array} roles - An array of allowed role IDs for this route.
 * @param {React.Node} children - The child components to render if the user has access.
 * @returns {React.Node} - Returns the child components if the user is authorized, otherwise redirects to the home page.
 */
const ProtectedRoute = ({ roles, children }) => {
  // Destructure user data from global state using Redux useSelector hook
  const { isAuth, isLoading, role } = useSelector((state) => state?.auth);
  // If the loading state is true, return a Preloader component
  if (isLoading) {
    return <PreLoader />;
  }
 
  // If the user is authenticated, check if their role is included in the allowed roles
  if (isAuth) {
    if (roles?.includes(role)) {
      // If the user's role is allowed, render the children components (protected content)
      return children;
    } else {
      // If the user's role is not allowed, render a "Page Not Found" message
      return <UnauthorizedPage />;
    }
  }

  // If the user is not authenticated, redirect to the home page
  return <Navigate to="/" />;
};

export default ProtectedRoute;
