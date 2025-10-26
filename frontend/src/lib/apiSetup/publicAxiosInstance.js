import axios from "axios";

// Base URL for the API, imported from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance for public routes (no authentication required)
const publicAxiosInstance = axios.create({
  baseURL: API_BASE_URL, // Set the base URL for the API
});

// This instance is used for making unauthenticated requests,
// so no Authorization header is added in this instance.

export { publicAxiosInstance as publicAxios };
