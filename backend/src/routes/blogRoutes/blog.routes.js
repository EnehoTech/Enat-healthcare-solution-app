import { Router } from "express";
import {
  createBlogController,
  deleteBlogByIdController,
  getAllBlogsController,
  getBlogByIdController,
  updateBlogByIdController,
} from "../../controllers/blogControllers/blog.controllers.js";
import {
  blogIdValidator,
  createBlogValidator,
  updateBlogValidator,
} from "../../validation/blog.validation.js";

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

/**
 * POST /api/blogs
 * Creates a new blog record
 */
router.post("/blogs", createBlogValidator, createBlogController);

/**
 * PATCH /api/blogs/:blog_id
 * Partially update blog fields by blog_id
 */
router.patch("/blogs/:blog_id", updateBlogValidator, updateBlogByIdController);

/**
 * DELETE /api/blogs/:blog_id
 * Hard-deletes the blog by its blog_id
 */
router.delete("/blogs/:blog_id", blogIdValidator, deleteBlogByIdController);

// default export router
export default router;
