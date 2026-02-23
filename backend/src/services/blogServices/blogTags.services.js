// Import the useTransaction/query wrapper
import connection from "../../config/db.config.js";

/**
 * @function getAllTagsService
 * @description Fetches all active tags from tag table (soft delete supported).
 * Optionally filters by a search term (q) using LIKE.
 * @param {string|null} [q=null] - Optional search keyword to filter tags by name.
 * @returns {Promise<Array<Object>>} A list of tags.
 * @throws {Error} If a database error occurs.
 */
export const getAllTagsService = async (q = null) => {
  try {
    // 1. Construct base query
    let query = `
      SELECT 
        t.id,
        t.name,
        t.created_at,
        t.updated_at
      FROM tag t
      WHERE t.deleted_at IS NULL
    `;

    const params = [];

    // 2. Optional search filter
    if (q) {
      query += `AND t.name LIKE ?`;
      params.push(`%${q}%`);
    }

    // 3. Sorting + limit (same style as gallery)
    query += ` ORDER BY t.name ASC LIMIT 50`;

    const rows = await connection.query(query, params);

    if (!rows || rows.length === 0) {
      return [];
    }

    // 4. Map rows into clean response objects (same pattern as gallery)
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  } catch (error) {
    console.error("Error while retrieving tags in getAllTagsService:", error);
    throw error;
  }
};
