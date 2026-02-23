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
        b.blog_id, b.user_id, b.image_gallery_id, b.blog_title, b.blog_description, b.created_at, b.updated_at, 
        bd.id AS detail_id, bd.hash, bd.detail_description, bd.blog_main_highlight, bd.blog_post_wrap_up,
        u.email,
        up.first_name, up.last_name, up.user_name, up.user_color,
        upp.profile_picture,
        ig.image_name, ig.image_url, ig.image_type
      FROM 
        blog AS b
      LEFT JOIN blog_detail AS bd ON b.blog_id = bd.blog_id AND bd.deleted_at IS NULL
      JOIN \`user\` AS u ON b.user_id = u.id
      LEFT JOIN user_profile AS up ON u.id = up.user_id
      LEFT JOIN user_profile_picture AS upp ON u.id = upp.user_id
      LEFT JOIN image_gallery AS ig ON b.image_gallery_id = ig.id AND ig.deleted_at IS NULL
      WHERE 
        b.deleted_at IS NULL 
      ORDER BY 
        b.created_at DESC
      LIMIT 9;
    `;

    const rows = await connection.query(query);

    if (!rows.length) return [];
    const blogs = rows?.map((row) => ({
      id: row.blog_id,
      user_id: row.user_id,
      blog_img: row.image_gallery_id
        ? {
            id: row.image_gallery_id,
            image_name: row.image_name,
            image_url: row.image_url,
            image_type: row.image_type,
          }
        : null,
      blog_title: row.blog_title,
      blog_description: row.blog_description,
      // Check if blog_detail exists, else return null
      blog_detail: row.detail_id
        ? {
            id: row.detail_id,
            hash: row.hash,
            description: row.detail_description,
            highlight: row.blog_main_highlight,
            wrap_up: row.blog_post_wrap_up,
          }
        : null,
      // User Profile and Picture information
      user: {
        id: row.user_id,
        email: row.email,
        first_name: row.first_name || null,
        last_name: row.last_name || null,
        user_name: row.user_name || null,
        user_color: row.user_color || null,
        profile_picture: row.profile_picture || null,
      },
      created_at: row.created_at,
      updated_at: row.updated_at,
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
        b.blog_id, b.user_id, b.image_gallery_id, b.blog_title, b.blog_description, b.created_at, b.updated_at,
        u.email, up.first_name, up.last_name, up.user_name, up.user_color,
        upp.profile_picture,
        ig.image_name, ig.image_url, ig.image_type
      FROM 
        blog AS b
      JOIN \`user\` AS u ON u.id = b.user_id
      LEFT JOIN user_profile AS up ON u.id = up.user_id AND up.deleted_at IS NULL
      LEFT JOIN user_profile_picture AS upp ON u.id = upp.user_id
      LEFT JOIN image_gallery AS ig ON b.image_gallery_id = ig.id AND ig.deleted_at IS NULL
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
        id: row.user_id,
        email: row.email,
        first_name: row.first_name || null,
        last_name: row.last_name || null,
        user_name: row.user_name || null,
        user_color: row.user_color || null,
        profile_picture: row.profile_picture || null,
      },
      blog_img: row.image_gallery_id
        ? {
            id: row.image_gallery_id,
            image_name: row.image_name,
            image_url: row.image_url,
            image_type: row.image_type,
          }
        : null,
      blog_title: row.blog_title,
      blog_description: row.blog_description,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    return blog;
  } catch (error) {
    console.error(`Error while retrieving blogs By ID:`, error);
    throw error;
  }
};

/**
 * @function getBlogsByUserIdService
 * @description Retrieves the 20 most recent blog titles for a specific user (non-deleted).
 * @param {number|string} userId - The ID of the owner.
 * @param {string|null} q - Optional search keyword (blog_title only).
 * @returns {Promise<Array>} List of up to 20 blog records (id + title).
 */
export const getBlogsByUserIdService = async (userId, q = null) => {
  try {
    let query = `
      SELECT
        blog_id,
        blog_title
      FROM blog
      WHERE user_id = ?
        AND deleted_at IS NULL
    `;

    const params = [userId];

    // Optional search on title only
    if (q) {
      query += ` AND blog_title LIKE ?`;
      params.push(`%${q}%`);
    }

    // Order + limit for performance
    query += ` ORDER BY created_at DESC LIMIT 20`;

    const rows = await connection.query(query, params);
    return rows || [];
  } catch (error) {
    console.error(
      `Database error in getBlogsByUserIdService (User: ${userId}):`,
      error
    );
    throw new Error("Failed to retrieve user blog titles.");
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
  image_gallery_id,
  blog_title,
  blog_description,
}) => {
  try {
    const result = await connection.query(
      `
      INSERT INTO blog (user_id, image_gallery_id, blog_title, blog_description)
      VALUES (?, ?, ?, ?)
    `,
      [user_id, image_gallery_id, blog_title, blog_description],
    );
    // newly inserted  blog Id
    const newBlogId = result.insertId;

    // Fetch the inserted row with author, profile, and image_gallery data
    const rows = await connection.query(
      `SELECT
         b.blog_id, b.user_id,
         u.email,
         up.first_name, up.last_name, up.user_name, up.phone_number,
         b.image_gallery_id, b.blog_title, b.blog_description,
         b.created_at, b.updated_at,
         ig.image_name, ig.image_url, ig.image_type
       FROM blog AS b
       JOIN \`user\` AS u ON u.id = b.user_id
       LEFT JOIN user_profile AS up ON up.user_id = u.id AND up.deleted_at IS NULL
       LEFT JOIN image_gallery AS ig ON b.image_gallery_id = ig.id AND ig.deleted_at IS NULL
       WHERE b.blog_id = ?
       LIMIT 1`,
      [newBlogId],
    );
    if (!rows.length) return null;

    const row = rows[0];
    return {
      blog_id: row.blog_id,
      user_id: row.user_id,
      user: {
        user_id: row.user_id,
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        user_name: row.user_name,
        phone_number: row.phone_number,
      },
      blog_img: row.image_gallery_id
        ? {
            id: row.image_gallery_id,
            image_name: row.image_name,
            image_url: row.image_url,
            image_type: row.image_type,
          }
        : null,
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
 * Updates a blog in the database, replacing the image file if a new one is provided.
 * @param {number} blogId - ID of the blog to update.
 * @param {Object} updates - Updated blog fields.
 * @returns {Promise<Object|null>} Updated blog or null if not found.
 */
export const updateBlogByIdService = async (blogId, updates) => {
  try {
    // 1. Fetch existing blog data
    const checkExistingBlogs = await connection.query(
      "SELECT * FROM blog WHERE blog_id = ? AND deleted_at IS NULL",
      [blogId]
    );

    const blogExists =
      checkExistingBlogs && checkExistingBlogs.length > 0
        ? checkExistingBlogs[0]
        : null;

    if (!blogExists) {
      return null;
    }

    // 2. Update the database
    const query = `
      UPDATE blog
      SET 
        image_gallery_id = ?,
        blog_title = ?, 
        blog_description = ?
      WHERE blog_id = ? AND deleted_at IS NULL
    `;

    const params = [
      updates.image_gallery_id || blogExists.image_gallery_id,
      updates.blog_title || blogExists.blog_title,
      updates.blog_description || blogExists.blog_description,
      blogId,
    ];

    await connection.query(query, params);

    // 3. Fetch and return the updated record with image_gallery join
    const rows = await connection.query(
      `SELECT
         b.blog_id, b.user_id, b.image_gallery_id, b.blog_title, b.blog_description, b.created_at, b.updated_at,
         ig.image_name, ig.image_url, ig.image_type
       FROM blog AS b
       LEFT JOIN image_gallery AS ig ON b.image_gallery_id = ig.id AND ig.deleted_at IS NULL
       WHERE b.blog_id = ?
       LIMIT 1`,
      [blogId]
    );

    if (!rows.length) return null;
    const row = rows[0];
    return {
      blog_id: row.blog_id,
      user_id: row.user_id,
      blog_img: row.image_gallery_id
        ? {
            id: row.image_gallery_id,
            image_name: row.image_name,
            image_url: row.image_url,
            image_type: row.image_type,
          }
        : null,
      blog_title: row.blog_title,
      blog_description: row.blog_description,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  } catch (error) {
    console.error("Error while updating blog:", error);
    throw error;
  }
};

/**
 * @function deleteBlogByIdService
 * @description Soft-deletes a blog and all its associated details, tags, and images.
 * @param {number} blogId - The ID of the blog to soft-delete.
 * @returns {Promise<Object|null>} Deletion summary or null if the blog doesn't exist.
 */
export const deleteBlogByIdService = async (blogId) => {
  try {
    return await connection.useTransaction(async (txConnection) => {
      // 1. Locate the blog and ensure it's not already deleted
      const [blogFound] = await txConnection.execute(
        `SELECT blog_id FROM blog WHERE blog_id = ? AND deleted_at IS NULL LIMIT 1`,
        [blogId]
      );

      if (blogFound.length === 0) {
        return null;
      }

      // 2. Locate the associated blog_detail
      const [detailFound] = await txConnection.execute(
        `SELECT id FROM blog_detail WHERE blog_id = ? AND deleted_at IS NULL LIMIT 1`,
        [blogId]
      );

      const blogDetailId = detailFound.length > 0 ? detailFound[0].id : null;

      // 3. If a detail exists, soft-delete all child associations
      if (blogDetailId) {
        // Soft-delete tags links
        await txConnection.execute(
          `UPDATE blog_detail_tag SET deleted_at = NOW(), updated_at = NOW()
           WHERE blog_detail_id = ? AND deleted_at IS NULL`,
          [blogDetailId]
        );

        // Soft-delete gallery images links
        await txConnection.execute(
          `UPDATE blog_detail_img SET deleted_at = NOW(), updated_at = NOW()
           WHERE blog_detail_id = ? AND deleted_at IS NULL`,
          [blogDetailId]
        );

        // Soft-delete recommendation links
        await txConnection.execute(
          `UPDATE related_blog_post SET deleted_at = NOW(), updated_at = NOW()
           WHERE blog_detail_id = ? OR blog_id = ? AND deleted_at IS NULL`,
          [blogDetailId, blogId]
        );

        // Soft-delete the detail record
        await txConnection.execute(
          `UPDATE blog_detail SET deleted_at = NOW(), updated_at = NOW()
           WHERE id = ? AND deleted_at IS NULL`,
          [blogDetailId]
        );
      }

      // 4. Finally, soft-delete the main blog record
      const [upd] = await txConnection.execute(
        `UPDATE blog SET deleted_at = NOW(), updated_at = NOW()
         WHERE blog_id = ? AND deleted_at IS NULL`,
        [blogId]
      );

      if (upd.affectedRows !== 1) {
        throw new Error("Failed to update blog record for soft-delete.");
      }

      return {
        deleted: true,
        blog_id: blogId,
        blog_detail_id: blogDetailId,
        timestamp: new Date(),
      };
    });
  } catch (error) {
    console.error("Error in deleteBlogByIdService:", error);
    throw error;
  }
};
