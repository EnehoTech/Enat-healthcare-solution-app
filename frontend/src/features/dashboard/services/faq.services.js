import { protectedAxios, publicAxios } from "../../../lib/apiSetup";

/**
 * @function getAllFaqsService
 * @description Retrieves all frequently asked questions from the system.
 * @returns {Promise<Object>} API response data.
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
 * @function getFaqByIdService
 * @description Retrieves a single FAQ by its unique ID.
 * @param {number|string} faqId - The ID of the FAQ.
 * @returns {Promise<Object>} API response data.
 */
export const getFaqByIdService = async (faqId) => {
  try {
    const response = await publicAxios.get(`/faqs/${faqId}`);
    return response.data;
  } catch (error) {
    console.error(`Error while retrieving FAQ with ID ${faqId}:`, error);
    throw error;
  }
};

/**
 * @function createFaqService
 * @description Creates a new FAQ entry (Admin/PR privileges required).
 * @param {Object} faqData - The FAQ object { question, answer }.
 * @returns {Promise<Object>} API response data.
 */
export const createFaqService = async (faqData) => {
  try {
    const response = await protectedAxios.post(`/faqs`, faqData);
    return response.data;
  } catch (error) {
    console.error("Error while creating FAQ:", error);
    throw error;
  }
};

/**
 * @function updateFaqService
 * @description Updates an existing FAQ entry.
 * @param {number|string} faqId - The ID of the FAQ to update.
 * @param {Object} faqData - The partial data to update.
 * @returns {Promise<Object>} API response data.
 */
export const updateFaqService = async (faqId, faqData) => {
  try {
    const response = await protectedAxios.patch(`/faqs/${faqId}`, faqData);
    return response.data;
  } catch (error) {
    console.error(`Error while updating FAQ with ID ${faqId}:`, error);
    throw error;
  }
};

/**
 * @function deleteFaqService
 * @description Soft deletes an FAQ entry.
 * @param {number|string} faqId - The ID of the FAQ to delete.
 * @returns {Promise<Object>} API response data.
 */
export const deleteFaqService = async (faqId) => {
  try {
    const response = await protectedAxios.delete(`/faqs/${faqId}`);
    return response.data;
  } catch (error) {
    console.error(`Error while deleting FAQ with ID ${faqId}:`, error);
    throw error;
  }
};
