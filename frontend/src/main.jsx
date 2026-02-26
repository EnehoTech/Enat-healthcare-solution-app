import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import store from "./redux/store/store.js";
import App from "./App.jsx";

// react bootstrap css files
import "bootstrap/dist/css/bootstrap.min.css";
// import react-slick-carousel css for slick and them.
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// custom styles
import "./assets/css/style.css";
// import "./assets/css/calcBmi.css";
import "./index.css";
import "./styles/global.css";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>  
    </Provider>
  </StrictMode>
);
