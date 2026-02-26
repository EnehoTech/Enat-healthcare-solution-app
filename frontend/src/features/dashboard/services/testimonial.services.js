import { protectedAxios } from "../../../lib/apiSetup";

/**
 * @function getAllTestimonialsService
 * @description Retrieves all active testimonials.
 * @returns {Promise<Object>}
 */
export const getAllTestimonialsService = async () => {
  try {
    const response = await protectedAxios.get("/testimonials");
    return response.data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    throw error;
  }
};

/**
 * @function getTestimonialByIdService
 * @description Fetches a single testimonial by ID.
 * @param {number|string} testimonialId
 */
export const getTestimonialByIdService = async (testimonialId) => {
  try {
    const response = await protectedAxios.get(`/testimonials/${testimonialId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching testimonial ID [${testimonialId}]:`, error);
    throw error;
  }
};

/**
 * @function createTestimonialService
 * @description Creates a new testimonial. Uses FormData for image upload.
 * @param {FormData} formData - Should contain testimonial_text, full_name, job_title, bg_color, and testifier_avatar.
 */
export const createTestimonialService = async (formData) => {
  try {
    const response = await protectedAxios.post("/testimonials", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating testimonial:", error);
    throw error;
  }
};

/**
 * @function updateTestimonialService
 * @description Updates an existing testimonial.
 * @param {number|string} testimonialId
 * @param {FormData} formData - Updated testimonial data.
 */
export const updateTestimonialService = async (testimonialId, formData) => {
  try {
    const response = await protectedAxios.patch(
      `/testimonials/${testimonialId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating testimonial ID [${testimonialId}]:`, error);
    throw error;
  }
};

/**
 * @function deleteTestimonialService
 * @description Soft-deletes a testimonial.
 * @param {number|string} testimonialId
 */
export const deleteTestimonialService = async (testimonialId) => {
  try {
    const response = await protectedAxios.delete(
      `/testimonials/${testimonialId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting testimonial ID [${testimonialId}]:`, error);
    throw error;
  }
};
