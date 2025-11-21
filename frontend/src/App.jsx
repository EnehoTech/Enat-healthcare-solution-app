import { Slide, ToastContainer } from "react-toastify";
import AppRoutes from "./routes";
import ScrollRouteToTop from "./constants/ScrollRouteToTop/ScrollRouteToTop";

function App() {
  return (
    <>
      <ToastContainer autoClose={3000} theme="colored" transition={Slide} />
      <ScrollRouteToTop />
      <AppRoutes />
    </>
  );
}

export default App;
