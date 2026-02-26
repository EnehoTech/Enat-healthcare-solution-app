import fs from "fs/promises";
import path from "path";
// Import the query function from the db.config.js file
import connection from "../../config/db.config.js";

/**
 * Service to get all testimonials.
 * @returns {Promise<Array>} List of testimonials.
 */
export const getTestimonialsService = async () => {
  const query = `
    SELECT 
      t.* 
    FROM 
      testimonial AS t
    WHERE 
      t.deleted_at IS NULL
    ORDER BY 
      t.created_at DESC;
  `;
  const rows = await connection.query(query);
  return rows;
};

/**
 * Service to get a testimonial by ID.
 * @param {number} testimonialId - ID of the testimonial.
 * @returns {Promise<Object|null>} Testimonial data or null if not found.
 */
export const getTestimonialByIdService = async (testimonialId) => {
  const query = `
    SELECT 
      t.*
    FROM 
      testimonial AS t
    WHERE 
      t.id = ? AND t.deleted_at IS NULL;
  `;
  const rows = await connection.query(query, [testimonialId]);
  return rows.length>0 ? rows[0] : null;
};
/**
 * @function createTestimonialService
 * @description Service to create a new testimonial.
 * @param {Object} params - Testimonial creation parameters.
 * @param {number} params.bg_class_id - Background class ID for the testimonial.
 * @param {string} params.testimonial_text - Text of the testimonial.
 * @param {string} [params.full_name] - Full name of the testifier.
 * @param {string} [params.job_title] - Job title of the testifier.
 * @param {string} [params.testifier_avatar] - Avatar image URL of the testifier (optional).
 * @param {string} [params.bg_color] - bg color of the testifier incase avatar upload is skipped.
 * @returns {Promise<Object>} Newly created testimonial.
 * @throws {Error} If an error occurs during the testimonial creation.
 */
export const createTestimonialService = async ({
  testimonial_text,
  full_name,
  job_title,
  testifier_avatar = null,
  bg_color,
}) => {
  try {
    const result = await connection.query(
      `
      INSERT INTO testimonial ( testimonial_text, full_name, job_title, testifier_avatar, bg_color)
      VALUES ( ?, ?, ?, ?,?);
    `,
      [
        testimonial_text,
        full_name,
        job_title,
        testifier_avatar,
        bg_color,
      ]
    );

    return {
      id: result.insertId,
      testimonial_text,
      full_name,
      job_title,
      testifier_avatar,
      bg_color,
    };
  } catch (error) {
    console.error("Error while creating testimonial:", error);
    throw error;
  }
};

/**
 * @function checkTestimonialAvatarExists
 * @description Checks if a testimonial avatar exists by its testimonial ID and returns the avatar path.
 * @param {number} testimonialId - ID of the testimonial.
 * @returns {Promise<Object|null>} The avatar path if found, or null if not found.
 */
const checkTestimonialAvatarExists = async (testimonialId) => {
  const result = await connection.query(
    "SELECT testifier_avatar FROM testimonial WHERE id = ? AND deleted_at IS NULL",
    [testimonialId]
  );
  return result.length > 0 ? result[0] : null;
};



/**
 * @function updateTestimonialService
 * @description Updates a testimonial in the database, removing the avatar if `testifier_avatar` is null and replacing it if updated.
 * @param {number} testimonialId - ID of the testimonial to update.
 * @param {Object} updates - Updated testimonial fields.
 * @param {number} [updates.bg_class_id] - Background class ID for the testimonial.
 * @param {string} [updates.testimonial_text] - Text of the testimonial.
 * @param {string} [updates.full_name] - Full name of the testifier (optional).
 * @param {string} [updates.job_title] - Job title of the testifier (optional).
 * @param {string|null} [updates.testifier_avatar] - New avatar path or null to remove the avatar.
 * @returns {Promise<Object|null>} Updated testimonial or null if not found.
 * @throws {Error} If an update or avatar deletion fails.
 */
export const updateTestimonialService = async (testimonialId, updates) => {
  try {
    let testimonialAvatarPath = updates.testifier_avatar;

    // Retrieve the existing testimonial to determine the current avatar path
    const existingTestimonial = await checkTestimonialAvatarExists(testimonialId);
    if (!existingTestimonial) {
      return null; // Testimonial not found
    }

    if (updates.testifier_avatar === null) {
      // If explicitly null, delete the existing avatar file and set database field to NULL
      if (existingTestimonial?.testifier_avatar) {
        const oldFilePath = path.join(
          process.cwd(),
          existingTestimonial.testifier_avatar
        );
        try {
          await fs.unlink(oldFilePath); // Remove the old avatar file
          testimonialAvatarPath = null; // Ensure the database entry is updated to NULL
        } catch (error) {
          console.error(`Error deleting testimonial avatar: ${error.message}`);
        }
      }
    } else if (updates.testifier_avatar) {
      // If a new avatar is provided, delete the old one
      if (existingTestimonial?.testifier_avatar) {
        const oldFilePath = path.join(
          process.cwd(),
          existingTestimonial.testifier_avatar
        );
        try {
          await fs.unlink(oldFilePath); // Delete the old avatar file
        } catch (error) {
          console.error(`Error deleting old testimonial avatar: ${error.message}`);
        }
      }
    }

    // Update the testimonial record in the database
    const updateResult = await connection.query(
      `
      UPDATE testimonial
      SET  testimonial_text = ?, full_name = ?, job_title = ?, testifier_avatar = ?
      WHERE id = ? AND deleted_at IS NULL
      `,
      [
        updates.testimonial_text,
        updates.full_name,
        updates.job_title,
        testimonialAvatarPath, // Update with new path or NULL
        testimonialId,
      ]
    );

    if (updateResult.affectedRows === 0) {
      return null; // No rows updated (testimonial not found or unchanged)
    }

    // Fetch and return the updated testimonial
    const updatedTestimonial = await connection.query(
      "SELECT * FROM testimonial WHERE id = ? AND deleted_at IS NULL",
      [testimonialId]
    );

    return updatedTestimonial.length > 0 ? updatedTestimonial[0] : null;
  } catch (error) {
    console.error("Error while updating testimonial:", error);
    throw error;
  }
};


/**
 * @function deleteTestimonialService
 * @description Marks a testimonial as deleted by setting the `deleted_at` field.
 * @param {number} testimonialId - ID of the testimonial to delete.
 * @returns {Promise<boolean>} True if the testimonial was marked as deleted, false otherwise.
 * @throws {Error} If there is an error during the deletion process.
 */
export const deleteTestimonialService = async (testimonialId) => {
  try {
    const query = `
      UPDATE testimonial
      SET deleted_at = NOW()
      WHERE id = ? AND deleted_at IS NULL;
    `;
    const result = await connection.query(query, [testimonialId]);
    return result.affectedRows > 0; // True if a row was updated, false otherwise
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }
};

