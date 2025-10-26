// Import the query function from the db.config.js file
import connection from "../../config/db.config.js";

/**
 * Service to get all blogs with aggregated user information.
 * @returns {Promise<Array>} List of blogs with user details.
 * @throws {Error} If there is an error during the database query.
 */
export const getAllBlogsService = async () => {
  try {
    const query = `
      SELECT 
        b.blog_id, b.user_id,u.email, u.display_name, b.blog_img, b.blog_title, b.blog_description,
        b.created_at, b.updated_at, b.deleted_at
      FROM 
        blog AS b
      JOIN \`user\` AS u ON u.id = b.user_id
      WHERE 
        b.deleted_at IS NULL
      ORDER BY 
        b.created_at DESC -- Order by the most recent blogs
       LIMIT 9;
    `;

    const rows = await connection.query(query);

    const blogs = rows?.map((row) => ({
      blog_id: row.blog_id,
      user_id: row.user_id,
      user: {
        user_id: row.user_id,
        email: row.email,
        display_name: row.display_name,
      },
      blog_img: row.blog_img,
      blog_title: row.blog_title,
      blog_description: row.blog_description,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
    }));

    return blogs;
  } catch (error) {
    console.error("Error while retrieving blogs:", error);
    throw error;
  }
};

/**
 * Service to get a single blog by ID with aggregated user information.
 * @param {number} blogId - The ID of the blog to retrieve.
 * @returns {Promise<Object|null>} The blog object with user details if found, or null if not found.
 * @throws {Error} If there is an error during the database query.
 */
export const getBlogByIdService = async (blogId) => {
  try {
    const query = `
      SELECT 
        b.blog_id, b.user_id, u.email, u.display_name, b.blog_img, b.blog_title, b.blog_description,
        b.created_at, b.updated_at, b.deleted_at
      FROM 
        blog AS b
      JOIN \`user\` AS u ON u.id = b.user_id
      WHERE 
        b.blog_id = ? AND b.deleted_at IS NULL;
    `;

    const rows = await connection.query(query, [blogId]);

    if (rows.length === 0) return null;
    const row = rows[0];
    const blog = {
      blog_id: row.blog_id,
      user_id: row.user_id,
      user: {
        user_id: row.user_id,
        email: row.email,
        display_name: row.display_name,
      },
      hash: row.hash,
      blog_img: row.blog_img,
      blog_title: row.blog_title,
      blog_description: row.blog_description,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
    };

    return blog;
  } catch (error) {
    console.error(`Error while retrieving blogs By ID:`, error);
    throw error;
  }
};

/**
 * @function createBlogService
 * @description Service function to create a new blog entry in the database.
 * @param {Object} params - Blog creation parameters.
 * @param {number} params.user_id - User ID of the blog creator.
 * @param {string} params.blog_img - Path to the uploaded blog image.
 * @param {string} params.blog_title - Title of the blog.
 * @param {string} params.blog_description - Short description of the blog.
 * @returns {Promise<Object>} The newly created blog entry.
 * @throws {Error} If any error occurs during blog creation.
 */
export const createBlogService = async ({
  user_id,
  blog_img,
  blog_title,
  blog_description,
}) => {
  try {
    const result = await connection.query(
      `
      INSERT INTO blog (user_id, blog_img, blog_title, blog_description)
      VALUES (?, ?, ?, ?)
    `,
      [user_id, blog_img, blog_title, blog_description]
    );
    // newly inserted  blog Id
    const newBlogId = result.insertId;

    // Fetch the inserted row with author data to build the nested response
    const rows = await connection.query(
      `SELECT
         b.blog_id, b.user_id,
         u.email, u.display_name,
         b.blog_img, b.blog_title, b.blog_description,
         b.created_at, b.updated_at
       FROM blog AS b
       JOIN \`user\` AS u ON u.id = b.user_id
       WHERE b.blog_id = ?
       LIMIT 1`,
      [newBlogId]
    );
    if (!rows.length) return null;

    const row = rows[0];
    return {
      blog_id: row.blog_id,
      user_id: row.user_id,
      user: {
        user_id: row.user_id,
        email: row.email,
        display_name: row.display_name,
      },
      blog_img: row.blog_img,
      blog_title: row.blog_title,
      blog_description: row.blog_description,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  } catch (error) {
    console.error("Error while creating blog:", error);
    throw error;
  }
};

/**
 * Updates a blog in the database, replacing the image if updated.
 * @param {number} blogId - ID of the blog to update.
 * @param {Object} updates - Updated blog fields.
 * @param {string} [updates.blog_title] - Blog title.
 * @param {string} [updates.blog_description] - Short description.
 * @param {string|null} [updates.blog_img] - New image path (optional).
 * @returns {Promise<Object|null>} Updated blog or null if not found.
 * @throws {Error} If an update or image deletion fails.
 */
export const updateBlogByIdService = async (blogId, updates) => {
  try {
  

    // Update the blog record
    const updateBlog = await connection.query(
      `
      UPDATE blog
      SET  blog_img = ?, blog_title = ?, blog_description = ?
      WHERE blog_id = ?
      `,
      [
        updates.blog_img,
        updates.blog_title,
        updates.blog_description,
        blogId,
      ]
    );

    if (updateBlog.affectedRows === 0) return null;

    // Fetch and return the updated blog
    const updatedBlog = await connection.query(
      "SELECT * FROM blog WHERE blog_id = ? AND deleted_at IS NULL",
      [blogId]
    );

    return updatedBlog.length > 0 ? updatedBlog[0] : null;
  } catch (error) {
    console.error("Error while updating blog:", error);
    throw error;
  }
};

/**
 * Service to delete a blog by ID.
 * @param {number} blogId - The ID of the blog to delete.
 * @returns {Promise<boolean>} Returns true if the blog was deleted, false otherwise.
 * @throws {Error} If there is an error during the deletion process.
 */
export const deleteBlogByIdService = async (blogId) => {
  try {
    const result = await connection.query(
      "UPDATE blog SET deleted_at = NOW() WHERE blog_id = ? AND deleted_at IS NULL",
      [blogId]
    );

    return result.affectedRows > 0; // Returns true if a row was affected, false otherwise.
  } catch (error) {
    console.error(`Error while deleting blog by ID`, error);
    throw error;
  }
};