import { Router } from "express";
import { createBlogDetailController, deleteBlogDetailByHashController, getAllBlogDetailsController, getBlogDetailByHashController, updateBlogDetailByHashController } from "../../controllers/blogControllers/blogDetail.controllers.js";
import { blogDetailByHashValidator, createBlogDetailValidator, updateBlogDetailValidator } from "../../validation/blogDetail.validation.js";


// Call the router method from express to create the router
const router = Router();

/**
 * GET /api/blog-details
 * Returns all blog_details (with blog, user, tags, images, related_blog_posts)
 */
router.get("/blog-details", getAllBlogDetailsController);

/**
 * GET /api/blog-details/:blog-detail-hash
 * Returns a single blog_detail by its blog detail by hash
 */
router.get(
  "/blog-details/:blog_detail_hash",
  blogDetailByHashValidator,
  getBlogDetailByHashController
);
/**
 * POST /api/blog-details
 * Creates a blog_detail + (tags, images, related_posts) in a single transaction.
 */
router.post(
  "/blog-details",
  createBlogDetailValidator,
  createBlogDetailController
);

/**
 * PATCH /api/blog-details/:blog_detail_hash
 * Partially update blog_detail fields and (optionally) replace tags/images/related_blog_posts
 */
router.patch(
  "/blog-details/:blog_detail_hash",
  updateBlogDetailValidator,
  updateBlogDetailByHashController
);

/**
 * DELETE /api/blog-details/:hash
 * Hard-deletes the blog_detail (children cascade via FKs)
 */
router.delete(
  "/blog-details/:blog_detail_hash",
  blogDetailByHashValidator,
  deleteBlogDetailByHashController
);



// default export router
export default router;