import { Router } from "express";
import {
  createBlogController,
  deleteBlogByIdController,
  getAllBlogsController,
  getBlogByIdController,
  getBlogsByUserIdController,
  updateBlogByIdController,
} from "../../controllers/blogControllers/blog.controllers.js";
import {
  blogIdValidator,
  createBlogValidator,
  getBlogByUserIdValidator,
  updateBlogValidator,
} from "../../validation/blog.validation.js";
import { authn, authz } from "../../middlewares/auth.middleware.js";
import { adminAndAbove } from "../../utils/authzRoles.js";

// Call the router method from express to create the router
const router = Router();

/**
 * GET /api/blogs
 * Returns all blogs (with basic blog info)
 */
router.get("/blogs", getAllBlogsController);

/**
 * GET /api/blogs/:blog_id
 * Returns a single blog by its blog_id
 */
router.get("/blogs/:blog_id", blogIdValidator, getBlogByIdController);
// GET /api/blogs/users/:user_id?q=optionalSearch
router.get(
  "/blogs/users/:user_id",
  authn,
  getBlogByUserIdValidator,
  getBlogsByUserIdController,
);
/**
 * POST /api/blogs
 * Creates a new blog record
 */
router.post(
  "/blogs",
  authn,
  authz(adminAndAbove),
  createBlogValidator,
  createBlogController,
);

/**
 * PATCH /api/blogs/:blog_id
 * Partially update blog fields by blog_id
 */
router.patch(
  "/blogs/:blog_id",
  authn,
  authz(adminAndAbove),
  updateBlogValidator,
  updateBlogByIdController,
);

/**
 * DELETE /api/blogs/:blog_id
 * Hard-deletes the blog by its blog_id
 */
router.delete(
  "/blogs/:blog_id",
  authn,
  authz(adminAndAbove),
  blogIdValidator,
  deleteBlogByIdController,
);

// default export router
export default router;
