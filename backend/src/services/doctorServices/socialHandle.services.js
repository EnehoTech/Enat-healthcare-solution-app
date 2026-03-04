// Import the query function from the db.config.js file
import connection from "../../config/db.config.js";

/**
 * @function getAllSocialPlatformsService
 * @description Fetches all records from the social_media_platform table.
 * @returns {Promise<Array>} List of platform objects.
 */
export const getAllSocialPlatformsService = async () => {
  try {
    const query = `
      SELECT 
        id, 
        platform_name, 
        icon_class_name, 
        created_at 
      FROM social_media_platform 
      WHERE deleted_at IS NULL
    `;

    const rows = await connection.query(query);
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error("Error in getAllSocialPlatformsService:", error);
    throw error;
  }
};
/**
 * @function getSocialHandleByIdService
 * @description Retrieves a single handle with platform details.
 */
export const getSocialHandleByIdService = async (id) => {
  try {
    const query = `
      SELECT 
        dsh.id, dsh.doctor_id, dsh.smp_id, 
        smp.platform_name, smp.icon_class_name, dsh.handle_link, dsh.created_at, dsh.updated_at
      FROM doctor_social_handle dsh
      INNER JOIN social_media_platform smp ON dsh.smp_id = smp.id
      WHERE dsh.id = ? AND dsh.deleted_at IS NULL
    `;
    const rows = await connection.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error in getSocialHandleByIdService:", error);
    throw error;
  }
};

/**
 * @function getSocialHandlesByDoctorService
 * @description Retrieves handles joined with the platform lookup table for a specific doctor.
 */
export const getSocialHandlesByDoctorIdService = async (doctorId) => {
  try {
    const query = `
      SELECT 
        dsh.id, dsh.doctor_id, dsh.smp_id, dsh.handle_link,
        smp.platform_name, smp.icon_class_name, dsh.handle_link, dsh.created_at, dsh.updated_at
      FROM doctor_social_handle dsh
      INNER JOIN social_media_platform smp ON dsh.smp_id = smp.id
      WHERE dsh.doctor_id = ? AND dsh.deleted_at IS NULL
    `;
    const rows = await connection.query(query, [doctorId]);
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error("error in getSocialHandlesByDoctorService:", error);
    throw error;
  }
};

/**
 * @function createSocialHandleService
 * @param {Object} data - { doctor_id, name, handle_link }
 * @returns {Promise<Object>}
 */

export const createSocialHandleService = async (data) => {
  try {
    const { doctor_id, smp_id, handle_link } = data;
    const result = await connection.query(
      "INSERT INTO doctor_social_handle (doctor_id, smp_id, handle_link) VALUES (?, ?, ?)",
      [doctor_id, smp_id, handle_link],
    );
    return await getSocialHandleByIdService(result.insertId);
  } catch (error) {
    console.error("error while creating social handle:", error);
    throw error;
  }
};

/**
 * @function updateSocialHandleService
 */
export const updateSocialHandleService = async (id, updates) => {
  try {
    const existing = await getSocialHandleByIdService(id);
    if (!existing) return null;

    const { smp_id, handle_link } = updates;
    await connection.query(
      "UPDATE doctor_social_handle SET smp_id = ?, handle_link = ?, updated_at = NOW() WHERE id = ?",
      [smp_id || existing.smp_id, handle_link || existing.handle_link, id],
    );
    return await getSocialHandleByIdService(id);
  } catch (error) {
    console.error("error in updateSocialHandleService:", error);
    throw error;
  }
};

/**
 * @function deleteSocialHandleService
 * @description Soft-deletes a single social handle by its unique ID.
 * @param {number} id - The primary key (id) of the handle to delete.
 * @returns {Promise<Object|null>} Returns deletion metadata or null if not found.
 */
export const deleteSocialHandleService = async (id) => {
  try {
    return await connection.useTransaction(async (txConnection) => {
      // 1) Locate the specific handle that isn't already soft-deleted
      const [found] = await txConnection.execute(
        "SELECT id FROM doctor_social_handle WHERE id = ? AND deleted_at IS NULL LIMIT 1",
        [id],
      );

      if (found.length === 0) {
        return null;
      }

      // 2) Soft-delete the specific handle
      const [upd] = await txConnection.execute(
        `UPDATE doctor_social_handle 
         SET deleted_at = NOW(), updated_at = NOW() 
         WHERE id = ? AND deleted_at IS NULL`,
        [id],
      );

      if (upd.affectedRows !== 1) {
        throw new Error("Failed to delete the doctor social handle.");
      }

      // 3) Read back the deleted_at timestamp for the response
      const [[row]] = await txConnection.execute(
        "SELECT id, deleted_at FROM doctor_social_handle WHERE id = ? LIMIT 1",
        [id],
      );

      return {
        deleted: true,
        id: row.id,
        deleted_at: row.deleted_at,
      };
    });
  } catch (error) {
    console.error("[Service Error] deleteSocialHandleService:", error.message);
    throw error;
  }
};
