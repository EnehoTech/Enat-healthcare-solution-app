import path from "path";
import fs from "fs/promises";
// Import the query function from the db.config.js file
import connection from "../../config/db.config.js";

// Helper to check if record exists
const checkImageExists = async (id) => {
  const rows = await connection.query(
    "SELECT * FROM image_gallery WHERE id = ? AND deleted_at IS NULL",
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

/**
 * @function getImageGalleryService
 * @description Fetches all active images joined with creator details from user and user_profile tables.
 * @param {string|null} [type=null] - The classification type to filter by (e.g., 'BLOG').
 * @returns {Promise<Array<Object>>} A list of images with detailed owner information.
 * @throws {Error} If a database error occurs.
 */
export const getImageGalleryService = async (type = null) => {
  try {
    // 1. Construct the query with Joins
    // We use aliases: ig (image_gallery), u (user), up (user_profile)
    let query = `
      SELECT 
        ig.*, 
        u.email, 
        up.first_name, 
        up.last_name,
        up.user_name
      FROM image_gallery ig
      INNER JOIN user u ON ig.user_id = u.id
      INNER JOIN user_profile up ON ig.user_id = up.user_id
      WHERE ig.deleted_at IS NULL
    `;

    const params = [];

    // 2. Add dynamic filtering
    if (type) {
      query += " AND ig.image_type = ?";
      params.push(type.toUpperCase());
    }

    // 3. Sorting by newest first, then limit
    query += " ORDER BY ig.created_at DESC LIMIT 50";

    const rows = await connection.query(query, params);
    if (rows.length === 0) {
      return []; // Return empty array if no records found
    }
    return rows?.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      image_name: row.image_name,
      image_url: row.image_url,
      image_type: row.image_type,
      user: {
        id: row.user_id,
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        user_name: row.user_name,
      },
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  } catch (error) {
    console.error(
      "Error while retrieving images in getImageGalleryService:",
      error
    );
    throw error;
  }
};

/**
 * @function getImageGalleryByIdService
 * @description Fetches a single active gallery image by its ID, including creator details.
 * @param {number} id - The unique ID of the gallery image.
 * @returns {Promise<Object|null>} The image record with user details, or null if not found.
 * @throws {Error} If a database error occurs.
 */
export const getImageGalleryByIdService = async (id) => {
  try {
    const query = `
      SELECT 
        ig.*, 
        u.email, 
        up.first_name, 
        up.last_name,
        up.user_name
      FROM image_gallery ig
      INNER JOIN user u ON ig.user_id = u.id
      INNER JOIN user_profile up ON ig.user_id = up.user_id
      WHERE ig.id = ? AND ig.deleted_at IS NULL
      LIMIT 1
    `;

    const rows = await connection.query(query, [id]);

    // Return the first record if found, otherwise return null
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error(
      `Error while retrieving image details in getImageGalleryByIdService (ID: ${id}):`,
      error
    );
    throw error;
  }
};

/**
 * @function getImagesByUserIdService
 * @description Retrieves the 20 most recent gallery images for a specific user.
 * @param {number} userId - The ID of the owner.
 * @param {string|null} type - Optional filter (BLOG or BLOG_DETAIL).
 * @returns {Promise<Array>} List of up to 20 image records.
 */
export const getImagesByUserIdService = async (userId, type = null) => {
  try {
    let query = `
      SELECT 
        ig.*, 
        u.email,  
        up.first_name, 
        up.last_name,
         up.user_name
      FROM image_gallery ig
      INNER JOIN user u ON ig.user_id = u.id
      INNER JOIN user_profile up ON ig.user_id = up.user_id
      WHERE ig.user_id = ? AND ig.deleted_at IS NULL
    `;
    
    const params = [userId];

    if (type) {
      query += " AND ig.image_type = ?";
      params.push(type.toUpperCase());
    }

    // Senior Practice: Always limit and order for "recent" queries to optimize DB performance
    query += " ORDER BY ig.created_at DESC LIMIT 20";

    const rows = await connection.query(query, params);
    return rows || [];

  } catch (error) {
    console.error(`Database error in getImagesByUserIdService (User: ${userId}):`, error);
    throw new Error("Failed to retrieve user images.");
  }
};

/**
 * @function createImageGalleryService
 * @description Registers a new image in the gallery. Handles unique name constraints.
 * @param {Object} params - Image metadata.
 * @returns {Promise<Object>} The created image record.
 * @throws {Error} If a duplicate name exists or a database error occurs.
 */
export const createImageGalleryService = async ({
  userId,
  imageName,
  imageUrl,
  imageType,
}) => {
  try {
    // 1. Attempt to insert the record
    const result = await connection.query(
      `INSERT INTO image_gallery (user_id, image_name, image_url, image_type) 
       VALUES (?, ?, ?, ?)`,
      [userId, imageName, imageUrl, imageType],
    );
    const newImageId = result.insertId;

    // 2. Fetch the newly created record to return full metadata
    const rows = await connection.query(
      "SELECT * FROM image_gallery WHERE id = ?",
      [newImageId],
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    // 3. Handle Duplicate Entry Error (MySQL Error Code: 1062)
    if (error.code === "ER_DUP_ENTRY") {
      console.warn(
        `Duplicate entry attempt: Image name "${imageName}" already exists.`,
      );

      // Throw a descriptive error so the controller can return a 409 Conflict
      const field = error.sqlMessage.includes("ux_image_name")
        ? "Image Name"
        : "Image URL";
      throw new Error(`${field} already exists. Please use a unique value.`);
    }
    // 4. Log and re-throw other unexpected database errors
    console.error("Database error in createImageGalleryService:", error);
    throw error;
  }
};


/**
 * @function updateImageGalleryService
 * @description Updates metadata or the physical file of a gallery image. 
 * Handles old file cleanup and unique constraint enforcement.
 * @param {number} id - The ID of the gallery record.
 * @param {Object} updates - The fields to update (imageName, imageUrl, imageType).
 * @returns {Promise<Object|null>} The updated record or null if not found.
 */
export const updateImageGalleryService = async (id, { imageName, imageUrl, imageType }) => {
  try {
    return await connection.useTransaction(async (tx) => {
      // 1. Use your helper to check existence of the image record
      const checkImageRowExists = await checkImageExists(id);
      if (!checkImageRowExists) return null;

      const existing = checkImageRowExists;

      // 2. Physical file cleanup: delete old file ONLY if a new one is successfully uploaded
      if (imageUrl && existing.image_url) {
        const oldFilePath = path.join(process.cwd(), existing.image_url);
        try {
          await fs.unlink(oldFilePath);
        } catch (err) {
          console.error(
            `Cleanup Warning: Could not delete old file ${oldFilePath}:`,
            err
          );
        }
      }

      // 3. Prepare final values (COALESCE logic)
      const finalName = imageName || existing.image_name;
      const finalUrl = imageUrl || existing.image_url;
      const finalType = imageType || existing.image_type;

      // 4. Perform Update
      await tx.execute(
        `UPDATE image_gallery 
         SET image_name = ?, image_url = ?, image_type = ? 
         WHERE id = ?`,
        [finalName, finalUrl, finalType, id]
      );

      // 5. Return updated record
      const [updatedRows] = await tx.execute(
        "SELECT * FROM image_gallery WHERE id = ?",
        [id]
      );
      return updatedRows[0];
    });
  } catch (error) {
    // Handle Duplicate Key (e.g., updating to an image_name that already exists)
    if (error.code === "ER_DUP_ENTRY") {
      const field = error.sqlMessage.includes("ux_image_name") ? "Image Name" : "Image URL";
      throw new Error(`${field} already exists. Please use a unique value.`);
    }
    
    console.error(`Database error in updateImageGalleryService (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * @function deleteImageGalleryService
 * @description Performs a soft delete on an image gallery record.
 * @param {number} id - The ID of the image gallery record to delete.
 * @returns {Promise<boolean>} Returns true if the record was successfully soft-deleted, false if not found.
 * @throws {Error} If a database error occurs during the update.
 */
export const deleteImageGalleryService = async (id) => {
  try {
    // 1. Check if the record exists using your helper
    const checkImageRowExists = await checkImageExists(id);
    if (!checkImageRowExists) return null;

    // 2. Perform the soft delete
    const row = await connection.query(
      "UPDATE image_gallery SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?",
      [id]
    );

    return row.affectedRows > 0;

  } catch (error) {
    // 3. Log database-level errors
    console.error(`Error in deleteImageGalleryService(ID: ${id}):`, error);
    throw error;
  }
};

