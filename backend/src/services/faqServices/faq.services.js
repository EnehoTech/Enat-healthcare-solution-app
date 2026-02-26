// Import the query function from the db.config.js file
import connection from "../../config/db.config.js";

/**
 * Service to get all FAQs.
 * @returns {Promise<Array>} List of all FAQs.
 * @throws {Error} If there is an error while fetching FAQs.
 */
export const getFaqsService = async () => {
  try {
    const query = `
      SELECT id, faq_question, faq_answer, created_at, updated_at 
      FROM faq WHERE deleted_at IS NULL ORDER BY created_at DESC;
    `;
    const faqs = await connection.query(query);
    return faqs;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
};

/**
 * Service to get an FAQ by ID.
 * @param {number} faqId - ID of the FAQ to retrieve.
 * @returns {Promise<Object|null>} The FAQ object if found, or null if not found.
 * @throws {Error} If there is an error while fetching the FAQ.
 */
export const getFaqByIdService = async (faqId) => {
  try {
    const query = `
      SELECT id, faq_question, faq_answer, created_at, updated_at 
      FROM faq WHERE id = ? AND deleted_at IS NULL;
    `;
    const rows = await connection.query(query, [faqId]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error(`Error fetching FAQ with ID ${faqId}:`, error);
    throw error;
  }
};

/**
 * Service to create a new FAQ.
 * @param {Object} faqData - Data for the new FAQ.
 * @param {string} faqData.faq_question - The FAQ question.
 * @param {string} faqData.faq_answer - The FAQ answer.
 * @returns {Promise<Object>} The newly created FAQ object.
 * @throws {Error} If there is an error while creating the FAQ.
 */
export const createFaqService = async ({ faq_question, faq_answer }) => {
  try {
    const query = `
      INSERT INTO faq (faq_question, faq_answer) VALUES (?, ?);
    `;
    const result = await connection.query(query, [faq_question, faq_answer]);
    return { id: result.insertId, faq_question, faq_answer };
  } catch (error) {
    console.error("Error while creating FAQ:", error);
    throw error;
  }
};

/**
 * Service to update an FAQ.
 * @param {number} faqId - ID of the FAQ to update.
 * @param {Object} faqData - Data to update the FAQ.
 * @param {string} faqData.faq_question - The updated FAQ question.
 * @param {string} faqData.faq_answer - The updated FAQ answer.
 * @returns {Promise<Object|null>} The updated FAQ object if successful, or null if not found.
 * @throws {Error} If there is an error while updating the FAQ.
 */
export const updateFaqService = async (faqId, { faq_question, faq_answer }) => {
  try {
    const query = `
      UPDATE faq SET faq_question = ?, faq_answer = ?, updated_at = NOW() 
      WHERE id = ? AND deleted_at IS NULL;
    `;
    const result = await connection.query(query, [faq_question, faq_answer, faqId]);
    return result.affectedRows > 0
      ? { faq_id: faqId, faq_question, faq_answer }
      : null;
  } catch (error) {
    console.error(`Error updating FAQ with ID:`, error);
    throw error;
  }
};

/**
 * Service to delete an FAQ.
 * @param {number} faqId - ID of the FAQ to delete.
 * @returns {Promise<boolean>} True if the FAQ was deleted successfully, false otherwise.
 * @throws {Error} If there is an error while deleting the FAQ.
 */
export const deleteFaqService = async (faqId) => {
  try {
    const query = `
      UPDATE faq SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL;
    `;
    const result = await connection.query(query, [faqId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error deleting FAQ with ID:`, error);
    throw error;
  }
};
