// import configureStore from redux toolkit;
import { configureStore } from "@reduxjs/toolkit";
// import authReducer from userSlice
import authReducer from "../slices/authSlice";
// import userReducer from userSlice
import onboardingReducer from "../slices/onboardingSlice";
// import userReducer from userSlice
import userReducer from "../slices/userSlice";

// ✅ Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, // Authentication-related state
    onboarding: onboardingReducer, // Onboarding-related state
    user: userReducer, // User-related state
  },
});

export default store;
