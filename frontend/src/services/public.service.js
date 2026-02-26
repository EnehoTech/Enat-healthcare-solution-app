import { publicAxios } from "../lib/apiSetup";

/**
 * @function getAllBlogs
 * @description Fetches all available blog posts from the public API. 
 * This is typically used for the main blog feed or listing page.
 * @returns {Promise<Object>} A promise that resolves to the API response data (usually an array of blog objects).
 * @throws {Error} Throws an error if the HTTP request fails (e.g., network error or 5xx status).
 */
export const getAllBlogsService = async () => {
  try {
    const response = await publicAxios.get(`/blogs`);
    return response.data;
  } catch (error) {
    console.error("Error while retrieving blogs:", error);
    throw error;
  }
};

/**
 * @function getBlogDetailByHash
 * @description Fetches a full blog detail payload from the server using the blog's hash.
 * @param {string} hash - The unique hash identifier for the blog detail.
 * @returns {Promise<Object>} The blog detail data.
 */
export const getBlogDetailByHashService = async (hash) => {
  try {
    const response = await publicAxios.get(`/blog-details/${hash}`);
    return response.data;
  } catch (error) {
    console.error(`Error while retrieving blog detail for hash [${hash}]:`, error);
    throw error;
  }
};


/**
 * @function getAllDepartments
 * @description Retrieves a list of all active departments.
 * @returns {Promise<Object>} API response data.
 */
export const getAllDepartmentsService = async () => {
  try {
    const response = await publicAxios.get(`/departments`);
    return response.data;
  } catch (error) {
    console.error("Error while retrieving departments:", error);
    throw error;
  }
};


/**
 * @function getAllDoctorsService
 * @description Retrieves a list of all active doctors with full profiles and social handles.
 * @returns {Promise<Object>} The API response containing the doctors array.
 * @throws {Error}
 */
export const getAllDoctorsService = async () => {
  try {
    const response = await publicAxios.get("/doctors");
    return response.data;
  } catch (error) {
    console.error("Error while retrieving doctors list:", error);
    throw error;
  }
};
/**
 * @function getAllServicesService
 * @description Fetches all active services (Public).
 */
export const getAllServicesService = async () => {
  try {
    const response = await publicAxios.get("/services");
    return response.data;
  } catch (error) {
    console.error("Error in getAllServicesService:", error);
    throw error;
  }
};

/**
 * @function getAllTestimonialsService
 * @description Retrieves all active testimonials.
 * @returns {Promise<Object>}
 */
export const getAllTestimonialsService = async () => {
  try {
    const response = await publicAxios.get("/testimonials");
    return response.data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    throw error;
  }
};

/**
 * A function to get all FAQs.
 * @returns {Promise<Object>} The response data containing all FAQs.
 * @throws {Error} If the request fails.
 */
export const getAllFaqsService = async () => {
  try {
    const response = await publicAxios.get(`/faqs`);
    return response.data;
  } catch (error) {
    console.error("Error while retrieving FAQs:", error);
    throw error;
  }
};

/**
 * @function createAppointmentRequestService
 * @description Patient-facing service to request a new appointment.
 * @access Public
 * @param {Object} data - Contains { full_name, email, case_description }
 */
export const createAppointmentRequestService = async (data) => {
  try {
    // Note: If patients aren't logged in, ensure protectedAxios handles null tokens gracefully
    const response = await publicAxios.post("/appointments", data);
    return response.data;
  } catch (error) {
    console.error("Error creating appointment request:", error);
    throw error;
  }
};


