// Import the useTransaction/query wrapper
import connection from "../../config/db.config.js";

/**
 * @function isNonEmptyArray
 * @description Helper that checks if a value is an array with at least one item.
 * @param {any} arr
 * @returns {boolean}
 */
export const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;

/**
 * @function getAllBlogDetailsService
 * @description Fetch all blog_details with blog/user, tags, images, and related_blog_posts in one go.
 *              No pagination per your docs; returns an empty array when none exist.
 * @returns {Promise<Array>}
 */
export const getAllBlogDetailsService = async () => {
  try {
    // 1) Load base rows (blog_detail + blog + user)
    const baseRows = await connection.query(
      `SELECT
         bd.id, bd.blog_id, bd.hash,
         bd.detail_description, bd.blog_main_highlight, bd.blog_post_wrap_up,
         bd.created_at, bd.updated_at,
         b.blog_img, b.blog_title, b.blog_description, b.user_id,
         u.email, u.display_name
       FROM blog_detail bd
       JOIN blog b ON b.blog_id = bd.blog_id
       JOIN user u ON u.id = b.user_id
       where bd.deleted_at IS NULL
       ORDER BY bd.created_at DESC`
    );

    if (baseRows.length === 0) return [];

    // 2) Gather IDs and build a single IN (...) placeholder string
    const ids = baseRows.map((r) => r.id);
    const placeholders = ids.map(() => "?").join(",");

    // 3) Load associations in bulk for those IDs
    const tagRows = await connection.query(
      `SELECT bdt.blog_detail_id, t.id AS tag_id, t.name
       FROM blog_detail_tag bdt
       JOIN tag t ON t.id = bdt.tag_id
       WHERE bdt.blog_detail_id IN (${placeholders})
       AND bdt.deleted_at IS NULL
       AND t.deleted_at IS NULL
       ORDER BY t.name ASC`,
      ids
    );

    const imgRows = await connection.query(
      `SELECT blog_detail_id, blog_img_url
       FROM blog_detail_img
       WHERE blog_detail_id IN (${placeholders})
        AND deleted_at IS NULL
       ORDER BY id ASC`,
      ids
    );

    const relRows = await connection.query(
      `SELECT rbp.blog_detail_id, rbp.blog_id, b.blog_title
       FROM related_blog_post rbp
       JOIN blog b ON b.blog_id = rbp.blog_id
       WHERE rbp.blog_detail_id IN (${placeholders})
        AND rbp.deleted_at IS NULL
       ORDER BY rbp.id ASC`,
      ids
    );

    // 4) Group associations by blog_detail_id
    const tagMap = new Map();
    for (const row of tagRows) {
      const list = tagMap.get(row.blog_detail_id) || [];
      list.push({ tag_id: row.tag_id, name: row.name });
      tagMap.set(row.blog_detail_id, list);
    }

    const imgMap = new Map();
    for (const row of imgRows) {
      const list = imgMap.get(row.blog_detail_id) || [];
      list.push({ blog_img_url: row.blog_img_url });
      imgMap.set(row.blog_detail_id, list);
    }

    const relMap = new Map();
    for (const row of relRows) {
      const list = relMap.get(row.blog_detail_id) || [];
      list.push({ blog_id: row.blog_id, blog_title: row.blog_title });
      relMap.set(row.blog_detail_id, list);
    }

    // 5) Compose final blog detail data(list view — no `hash` field per your example)
    const blogDetailData = baseRows.map((row) => ({
      id: row.id,
      blog: {
        blog_id: row.blog_id,
        blog_img: row.blog_img,
        blog_title: row.blog_title,
        blog_description: row.blog_description,
      },
      hash: row.hash,
      detail_description: row.detail_description,
      blog_main_highlight: row.blog_main_highlight,
      blog_post_wrap_up: row.blog_post_wrap_up,
      user: {
        user_id: row.user_id,
        email: row.email,
        display_name: row.display_name,
      },
      tags: tagMap.get(row.id) || [],
      images: imgMap.get(row.id) || [],
      related_blog_posts: relMap.get(row.id) || [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return blogDetailData;
  } catch (error) {
    console.error("Error while fetching get all blog details:", error);
    throw error; // let controller map to 500
  }
};

/**
 * @function getBlogDetailByHashService
 * @description Fetch a single blog_detail (by hash) with its blog/user, tags, images,
 *              and related_blog_posts. Returns null when not found.
 * @param {string} hash
 * @returns {Promise<Object|null>}
 */
export const getBlogDetailByHashService = async (hash) => {
  try {
    // 1) Load the base row (blog_detail + its blog + author)
    const baseRows = await connection.query(
      `SELECT
         bd.id, bd.blog_id, bd.hash,
         bd.detail_description, bd.blog_main_highlight, bd.blog_post_wrap_up,
         bd.created_at, bd.updated_at,
         b.blog_img, b.blog_title, b.blog_description, b.user_id,
         u.email, u.display_name
       FROM blog_detail bd
       JOIN blog b ON b.blog_id = bd.blog_id
       JOIN user u ON u.id = b.user_id
       WHERE bd.hash = ?
        AND bd.deleted_at IS NULL
       LIMIT 1`,
      [hash]
    );

    if (baseRows.length === 0) return null;

    const row = baseRows[0];
    const blogDetailId = row.id;

    // 2) Load associations (tags, images, related posts)
    const tagRows = await connection.query(
      `SELECT t.id AS tag_id, t.name
       FROM tag t
       JOIN blog_detail_tag bdt ON bdt.tag_id = t.id
       WHERE bdt.blog_detail_id = ?
         AND bdt.deleted_at IS NULL
         AND t.deleted_at IS NULL
       ORDER BY t.name ASC`,
      [blogDetailId]
    );

    const imgRows = await connection.query(
      `SELECT blog_img_url
       FROM blog_detail_img
       WHERE blog_detail_id = ?
        AND deleted_at IS NULL
       ORDER BY id ASC`,
      [blogDetailId]
    );

    const relRows = await connection.query(
      `SELECT rbp.blog_id, b.blog_title
       FROM related_blog_post rbp
       JOIN blog b ON b.blog_id = rbp.blog_id
       WHERE rbp.blog_detail_id = ?
        AND rbp.deleted_at IS NULL
       ORDER BY rbp.id ASC`,
      [blogDetailId]
    );

    // 3) Compose final detail payload (no `hash` field per your docs)
    return {
      id: row.id,
      blog: {
        blog_id: row.blog_id,
        blog_img: row.blog_img,
        blog_title: row.blog_title,
        blog_description: row.blog_description,
      },
      hash: row.hash,
      detail_description: row.detail_description,
      blog_main_highlight: row.blog_main_highlight,
      blog_post_wrap_up: row.blog_post_wrap_up,
      user: {
        user_id: row.user_id,
        email: row.email,
        display_name: row.display_name,
      },
      tags: tagRows.map((tag) => ({ tag_id: tag.tag_id, name: tag.name })),
      images: imgRows.map((img) => ({ blog_img_url: img.blog_img_url })),
      related_blog_posts: relRows.map((rel) => ({
        blog_id: rel.blog_id,
        blog_title: rel.blog_title,
      })),
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  } catch (error) {
    console.error("Error while fetching blog detail By hash:", error);
    throw error; // let the controller map to 500
  }
};

/**
 * @function getParentBlogWithAuthor
 * @description Load the parent blog and its author info inside an active transaction connection.
 * @param {import('mysql2/promise').PoolConnection} txConnection
 * @param {number} blogId
 * @returns {Promise<Object|null>}
 */
const getParentBlogWithAuthor = async (blogId) => {
  try {
    const rows = await connection.query(
      `SELECT
             b.blog_id, b.user_id, b.blog_img, b.blog_title, b.blog_description,
             u.email, u.display_name
           FROM blog b
           JOIN user u ON u.id = b.user_id
           WHERE b.blog_id = ?
           LIMIT 1`,
      [blogId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching parent blog with author:", error);
    throw error;
  }
};

/**
 * @function tagExists
 * @description Check if a tag exists inside an active transaction connection.
 * @param {import('mysql2/promise').PoolConnection} txConnection
 * @param {number} tagId
 * @returns {Promise<boolean>}
 */
const tagExists = async (tagId) => {
  try {
    const rows = await connection.query(
      `SELECT id FROM tag WHERE id = ? LIMIT 1`,
      [tagId]
    );
    return rows.length > 0;
  } catch (error) {
    console.error("Error checking tag existence:", error);
    throw error;
  }
};

/**
 * @function blogExists
 * @description Check if a blog exists inside an active transaction connection.
 * @param {import('mysql2/promise').PoolConnection} txConnection
 * @param {number} blogId
 * @returns {Promise<boolean>}
 */
const blogExists = async (blogId) => {
  try {
    const rows = await connection.query(
      `SELECT blog_id FROM blog WHERE blog_id = ? LIMIT 1`,
      [blogId]
    );
    return rows.length > 0;
  } catch (error) {
    console.error("Error checking blog existence:", error);
    throw error;
  }
};

/**
 * @typedef {Object} BlogDetailCreateInput
 * @property {number} blog_id
 * @property {string} hash
 * @property {string} detail_description
 * @property {string} blog_main_highlight
 * @property {string} blog_post_wrap_up
 * @property {{ tag_id: number }[]} [tags]
 * @property {{ blog_img_url: string }[]} [images]
 * @property {{ blog_id: number }[]} [related_blog_post]
 */

/**
 * @function createBlogDetailService
 * @description Creates a blog_detail and its associations within a single transaction.
 *              Uses simple, readable for…of loops and small existence helpers.
 * @param {BlogDetailCreateInput} blogDetailData
 * @returns {Promise<Object>} Blog detail payload matching your API docs
 * @throws {Error} Plain Error so controller can map to HTTP status codes
 */
export const createBlogDetailService = async (blogDetailData) => {
  const {
    blog_id,
    hash,
    detail_description,
    blog_main_highlight,
    blog_post_wrap_up,
    tags = [],
    images = [],
    related_blog_post = [],
  } = blogDetailData;

  try {
    const result = await connection.useTransaction(async (txConnection) => {
      // 0) Optional soft pre-check for duplicate hash (unique index will also protect)
      const [dup] = await txConnection.execute(
        `SELECT id FROM blog_detail WHERE hash = ? AND deleted_at IS NULL LIMIT 1`,
        [hash]
      );
      if (dup.length > 0) {
        throw new Error("A blog detail with these details already exists.");
      }

      // 1) Verify parent blog + author
      const parentBlog = await getParentBlogWithAuthor(blog_id);
      if (!parentBlog) {
        return null; // controller-friendly: 404 Not Found");
      }

      // 2) Insert blog_detail
      const [bdRes] = await txConnection.execute(
        `INSERT INTO blog_detail
           (blog_id, hash, detail_description, blog_main_highlight, blog_post_wrap_up)
         VALUES (?, ?, ?, ?, ?)`,
        [
          blog_id,
          hash,
          detail_description,
          blog_main_highlight,
          blog_post_wrap_up,
        ]
      );
      if (bdRes.affectedRows !== 1) {
        throw new Error("Failed to insert blog_detail.");
      }
      const blogDetailId = bdRes.insertId;

      // 3) Insert tags (validate each one)
      if (isNonEmptyArray(tags)) {
        for (const tag of tags) {
          const tagId = Number(tag?.tag_id);
          if (!tagId) continue;

          const isTagIdExist = await tagExists(tagId);
          if (!isTagIdExist) {
            throw new Error("One or more tag_id values do not exist.");
          }

          // IGNORE makes the operation idempotent on retries
          await txConnection.execute(
            `INSERT IGNORE INTO blog_detail_tag (blog_detail_id, tag_id) VALUES (?, ?)`,
            [blogDetailId, tagId]
          );
        }
      }

      // 4) Insert images
      if (isNonEmptyArray(images)) {
        for (const img of images) {
          const url = img?.blog_img_url?.toString();
          if (!url) continue;

          await txConnection.execute(
            `INSERT IGNORE INTO blog_detail_img (blog_detail_id, blog_img_url) VALUES (?, ?)`,
            [blogDetailId, url]
          );
        }
      }

      // 5) Insert related posts (validate each blog exists)
      if (isNonEmptyArray(related_blog_post)) {
        for (const rel of related_blog_post) {
          const relBlogId = Number(rel?.blog_id);
          if (!relBlogId) continue;

          const relPostId = await blogExists(relBlogId);
          if (!relPostId) {
            throw new Error("One or more related blog_id values do not exist.");
          }

          await txConnection.execute(
            `INSERT IGNORE INTO related_blog_post (blog_id, blog_detail_id) VALUES (?, ?)`,
            [relBlogId, blogDetailId]
          );
        }
      }

      // 6) Read back created detail + associations for response
      const [[bd]] = await txConnection.execute(
        `SELECT id, blog_id, hash, detail_description, blog_main_highlight, blog_post_wrap_up, created_at, updated_at
         FROM blog_detail WHERE id = ?`,
        [blogDetailId]
      );
      console.log("bd", bd);

      const [tagRows] = await txConnection.execute(
        `SELECT t.id AS tag_id, t.name
         FROM tag t
         JOIN blog_detail_tag bdt ON bdt.tag_id = t.id
         WHERE bdt.blog_detail_id = ?
         ORDER BY t.name ASC`,
        [blogDetailId]
      );

      const [imgRows] = await txConnection.execute(
        `SELECT blog_img_url
         FROM blog_detail_img
         WHERE blog_detail_id = ?
         ORDER BY id ASC`,
        [blogDetailId]
      );

      const [relRows] = await txConnection.execute(
        `SELECT rbp.blog_id, b.blog_title
         FROM related_blog_post rbp
         JOIN blog b ON b.blog_id = rbp.blog_id
         WHERE rbp.blog_detail_id = ?
         ORDER BY rbp.id ASC`,
        [blogDetailId]
      );

      // 7) Compose response (exactly as your docs)
      return {
        id: bd.id,
        blog: {
          blog_id: parentBlog.blog_id,
          blog_img: parentBlog.blog_img,
          blog_title: parentBlog.blog_title,
          blog_description: parentBlog.blog_description,
        },
        hash: bd.hash,
        detail_description: bd.detail_description,
        blog_main_highlight: bd.blog_main_highlight,
        blog_post_wrap_up: bd.blog_post_wrap_up,
        user: {
          user_id: parentBlog.user_id,
          email: parentBlog.email,
          display_name: parentBlog.display_name,
        },
        tags: tagRows.map((tag) => ({ tag_id: tag.tag_id, name: tag.name })),
        images: imgRows.map((img) => ({ blog_img_url: img.blog_img_url })),
        related_blog_post: relRows.map((relatedPost) => ({
          blog_id: relatedPost.blog_id,
          blog_title: relatedPost.blog_title,
        })),
        created_at: bd.created_at,
        updated_at: bd.updated_at,
      };
    });

    return result;
  } catch (error) {
    console.error("Error creating blog detail:", error);
    throw error;
  }
};

/**
 * @typedef {Object} BlogDetailPatchInput
 * @property {number} [blog_id]                // optional: move article to another blog
 * @property {string} [detail_description]     // optional
 * @property {string} [blog_main_highlight]    // optional
 * @property {string} [blog_post_wrap_up]      // optional
 * @property {{ tag_id: number }[]} [tags]     // optional: replace all tags if provided (can be empty to clear)
 * @property {{ blog_img_url: string }[]} [images] // optional: replace all images if provided (can be empty to clear)
 * @property {{ blog_id: number }[]} [related_blog_posts] // optional: replace all related posts if provided (can be empty to clear)
 */

/**
 * @function updateBlogDetailByHashService
 * @description Partially update a blog_detail by its hash. Only fields present in `patch`
 *              are updated. For arrays (tags/images/related_blog_posts), if provided,
 *              the service REPLACES the entire set; if omitted, they are left as-is.
 * @param {string} hash - The blog_detail.hash to locate the row
 * @param {BlogDetailPatchInput} patch - Partial payload with properties to update
 * @returns {Promise<Object|null>} Updated blog_detail payload, or null if not found
 * @throws {Error} Plain error; controller maps to HTTP status/messages per your API docs
 */
export const updateBlogDetailByHashService = async (
  hash,
  updatedBlogDetailData
) => {
  // Support both keys just in case (your docs use `related_blog_posts`)
  const {
    blog_id,
    detail_description,
    blog_main_highlight,
    blog_post_wrap_up,
    tags, // optional array
    images, // optional array
    related_blog_posts: relPostsInDoc, // optional array (docs)
    related_blog_post: relPostsLegacy, // optional (legacy in some snippets)
  } = updatedBlogDetailData;

  const related_blog_posts = Array.isArray(relPostsInDoc)
    ? relPostsInDoc
    : relPostsLegacy;

  try {
    return connection.useTransaction(async (txConnection) => {
      // 1) Locate the target blog_detail by hash
      const [foundRows] = await txConnection.execute(
        `SELECT id, blog_id
         FROM blog_detail
        WHERE hash = ? AND deleted_at IS NULL
        LIMIT 1`,
        [hash]
      );
      if (foundRows.length === 0) {
        // Let controller return 404
        return null;
      }
      const { id: blogDetailId, blog_id: currentBlogId } = foundRows[0];

      // 2) Dynamically update scalar columns only if present
      const sets = [];
      const params = [];

      if (typeof detail_description === "string") {
        sets.push("detail_description = ?");
        params.push(detail_description);
      }
      if (typeof blog_main_highlight === "string") {
        sets.push("blog_main_highlight = ?");
        params.push(blog_main_highlight);
      }
      if (typeof blog_post_wrap_up === "string") {
        sets.push("blog_post_wrap_up = ?");
        params.push(blog_post_wrap_up);
      }
      if (
        Number.isInteger(blog_id) &&
        blog_id > 0 &&
        blog_id !== currentBlogId
      ) {
        // Validate destination blog exists
        const [blogCheck] = await txConnection.execute(
          `SELECT blog_id FROM blog WHERE blog_id = ? LIMIT 1`,
          [blog_id]
        );
        if (blogCheck.length === 0) {
          throw new Error("Provided parameter is invalid."); // controller -> 400
        }
        sets.push("blog_id = ?");
        params.push(blog_id);
      }

      if (sets.length > 0) {
        const sql = `UPDATE blog_detail SET ${sets.join(", ")} WHERE id = ?`;
        params.push(blogDetailId);
        const [updRes] = await txConnection.execute(sql, params);
        if (updRes.affectedRows === 0) {
          // Unlikely here, but just in case
          throw new Error("Failed to update blog_detail.");
        }
      }

      // 3) If `tags` provided: validate → replace set
      if (tags !== undefined) {
        if (!Array.isArray(tags)) {
          throw new Error("Provided parameter is invalid."); // controller -> 400
        }

        // Validate all provided tag IDs exist (if non-empty)
        if (isNonEmptyArray(tags)) {
          const ids = tags
            .map((tag) => Number(tag?.tag_id))
            .filter((n) => Number.isInteger(n) && n > 0);
          if (ids.length !== tags.length) {
            throw new Error("Provided parameter is invalid."); // controller -> 400
          }
          // Check existence in one query
          const placeholders = ids.map(() => "?").join(",");
          const [existsRows] = await txConnection.execute(
            `SELECT id FROM tag WHERE id IN (${placeholders})`,
            ids
          );
          if (existsRows.length !== ids.length) {
            throw new Error("Provided parameter is invalid."); // controller -> 400 (one or more tag_id do not exist)
          }
        }

        // Replace tags set
        await txConnection.execute(
          `DELETE FROM blog_detail_tag WHERE blog_detail_id = ?`,
          [blogDetailId]
        );
        if (isNonEmptyArray(tags)) {
          for (const tag of tags) {
            await txConnection.execute(
              `INSERT INTO blog_detail_tag (blog_detail_id, tag_id) VALUES (?, ?)`,
              [blogDetailId, tag.tag_id]
            );
          }
        }
      }

      // 4) If `images` provided: replace set
      if (images !== undefined) {
        if (!Array.isArray(images)) {
          throw new Error("Provided parameter is invalid."); // controller -> 400
        }

        await txConnection.execute(
          `DELETE FROM blog_detail_img WHERE blog_detail_id = ?`,
          [blogDetailId]
        );
        if (isNonEmptyArray(images)) {
          for (const img of images) {
            const url = img?.blog_img_url?.toString();
            if (!url) continue;
            await txConnection.execute(
              `INSERT INTO blog_detail_img (blog_detail_id, blog_img_url) VALUES (?, ?)`,
              [blogDetailId, url]
            );
          }
        }
      }

      // 5) If `related_blog_posts` provided: validate → replace set
      if (related_blog_posts !== undefined) {
        if (!Array.isArray(related_blog_posts)) {
          throw new Error("Provided parameter is invalid."); // controller -> 400
        }

        if (isNonEmptyArray(related_blog_posts)) {
          const relIds = related_blog_posts
            .map((r) => Number(r?.blog_id))
            .filter((n) => Number.isInteger(n) && n > 0);
          if (relIds.length !== related_blog_posts.length) {
            throw new Error("Provided parameter is invalid."); // controller -> 400
          }

          const placeholders = relIds.map(() => "?").join(",");
          const [existsBlogs] = await txConnection.execute(
            `SELECT blog_id FROM blog WHERE blog_id IN (${placeholders})`,
            relIds
          );
          if (existsBlogs.length !== relIds.length) {
            throw new Error("Provided parameter is invalid."); // controller -> 400 (one or more related blog_id do not exist)
          }
        }

        await txConnection.execute(
          `DELETE FROM related_blog_post WHERE blog_detail_id = ?`,
          [blogDetailId]
        );
        if (isNonEmptyArray(related_blog_posts)) {
          for (const rel of related_blog_posts) {
            await txConnection.execute(
              `INSERT INTO related_blog_post (blog_id, blog_detail_id) VALUES (?, ?)`,
              [rel.blog_id, blogDetailId]
            );
          }
        }
      }

      // 6) Read back full payload for response
      // parent blog + author
      const [[pb]] = await txConnection.execute(
        `SELECT
         b.blog_id, b.blog_img, b.blog_title, b.blog_description,
         u.id AS user_id, u.email, u.display_name
       FROM blog b
       JOIN user u ON u.id = b.user_id
       JOIN blog_detail bd ON bd.blog_id = b.blog_id
      WHERE bd.id = ?
      LIMIT 1`,
        [blogDetailId]
      );

      // base row
      const [[bd]] = await txConnection.execute(
        `SELECT id, hash, detail_description, blog_main_highlight, blog_post_wrap_up, created_at, updated_at
         FROM blog_detail
        WHERE id = ?`,
        [blogDetailId]
      );

      // tags
      const [tagRows] = await txConnection.execute(
        `SELECT t.id AS tag_id, t.name
         FROM tag t
         JOIN blog_detail_tag bdt ON bdt.tag_id = t.id
        WHERE bdt.blog_detail_id = ?
        ORDER BY t.name ASC`,
        [blogDetailId]
      );

      // images
      const [imgRows] = await txConnection.execute(
        `SELECT blog_img_url
         FROM blog_detail_img
        WHERE blog_detail_id = ?
        ORDER BY id ASC`,
        [blogDetailId]
      );

      // related posts
      const [relRows] = await txConnection.execute(
        `SELECT rbp.blog_id, b.blog_title
         FROM related_blog_post rbp
         JOIN blog b ON b.blog_id = rbp.blog_id
        WHERE rbp.blog_detail_id = ?
        ORDER BY rbp.id ASC`,
        [blogDetailId]
      );

      // 7) Compose the API payload
      return {
        id: bd.id,
        blog: {
          blog_id: pb.blog_id,
          blog_img: pb.blog_img,
          blog_title: pb.blog_title,
          blog_description: pb.blog_description,
        },
        hash: bd.hash,
        detail_description: bd.detail_description,
        blog_main_highlight: bd.blog_main_highlight,
        blog_post_wrap_up: bd.blog_post_wrap_up,
        user: {
          user_id: pb.user_id,
          email: pb.email,
          display_name: pb.display_name,
        },
        tags: tagRows.map((tag) => ({ tag_id: tag.tag_id, name: tag.name })),
        images: imgRows.map((img) => ({ blog_img_url: img.blog_img_url })),
        related_blog_posts: relRows.map((rel) => ({
          blog_id: rel.blog_id,
          blog_title: rel.blog_title,
        })),
        created_at: bd.created_at,
        updated_at: bd.updated_at,
      };
    });
  } catch (error) {
    // Log and re-throw for controller to handle
    console.error("Error updating blog detail by hash:", error);
    throw error;
  }
};

/**
 * @function deleteBlogDetailByHashService
 * @description Soft-delete a blog_detail and all of its associations.
 *              Sets deleted_at = NOW() (and updated_at = NOW()) on:
 *              - blog_detail
 *              - blog_detail_tag
 *              - blog_detail_img
 *              - related_blog_post
 *              Returns { deleted: true, id, deleted_at } or null if not found.
 * @param {string} hash - The blog_detail.hash to soft-delete.
 * @returns {Promise<{deleted: true, id: number, deleted_at: string} | null>}
 * @throws {Error} Plain error; controller maps to API docs (400/404/500).
 */
export const deleteBlogDetailByHashService = async (hash) => {
  try {
    return await connection.useTransaction(async (txConnection) => {
      // 1) Locate target that isn't already soft-deleted
      const [found] = await txConnection.execute(
        `SELECT id FROM blog_detail WHERE hash = ? AND deleted_at IS NULL LIMIT 1`,
        [hash]
      );
      if (found.length === 0) {
        // Let controller send 404 per the API docs
        return null;
      }
      const blogDetailId = found[0].id;

      // 2) Soft-delete child rows first (prevents “ghost” actives)
      await txConnection.execute(
        `UPDATE blog_detail_tag
           SET deleted_at = NOW(), updated_at = NOW()
         WHERE blog_detail_id = ? AND deleted_at IS NULL`,
        [blogDetailId]
      );
      await txConnection.execute(
        `UPDATE blog_detail_img
           SET deleted_at = NOW(), updated_at = NOW()
         WHERE blog_detail_id = ? AND deleted_at IS NULL`,
        [blogDetailId]
      );
      await txConnection.execute(
        `UPDATE related_blog_post
           SET deleted_at = NOW(), updated_at = NOW()
         WHERE blog_detail_id = ? AND deleted_at IS NULL`,
        [blogDetailId]
      );

      // 3) Soft-delete parent row
      const [upd] = await txConnection.execute(
        `UPDATE blog_detail
            SET deleted_at = NOW(), updated_at = NOW()
          WHERE id = ? AND deleted_at IS NULL`,
        [blogDetailId]
      );
      if (upd.affectedRows !== 1) {
        throw new Error("Failed to delete blog_detail.");
      }

      // 4) Read back the deleted_at timestamp for response
      const [[row]] = await txConnection.execute(
        `SELECT id, deleted_at FROM blog_detail WHERE id = ? LIMIT 1`,
        [blogDetailId]
      );

      return { deleted: true, id: row.id, deleted_at: row.deleted_at };
    });
  } catch (error) {
    console.error("Error deleting blog detail by hash:", error);
    throw error; // let controller map to 500
  }
};
