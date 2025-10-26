// import axios from "axios";

// // Base URL for the API, imported from environment variables
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Create an Axios instance for protected routes
// const protectedAxiosInstance = axios.create({
//   baseURL: API_BASE_URL, // Set the base URL for the API
// });

// // Interceptor to add the access token to the headers of each request
// protectedAxiosInstance.interceptors.request.use(
//   (config) => {
//     // Retrieve the access token from local storage
//     const token = localStorage.getItem("_u_at_i");

//     // If the token exists, add it to the Authorization header
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config; // Return the modified config
//   },
//   (error) => Promise.reject(error) // Reject the promise with the error
// );

// // Interceptor to handle responses and errors
// protectedAxiosInstance.interceptors.response.use(
//   (response) => response, // If the response is successful, return it as is
//   (error) => {
//     // If an error occurs, handle it here or propagate it to be handled by the caller
//     return Promise.reject(error); // Reject the promise with the original error
//   }
// );

// // Export the protectedAxios instance for use in protected API calls
// export { protectedAxiosInstance as protectedAxios };
