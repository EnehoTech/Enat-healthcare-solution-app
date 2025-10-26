import { body, param, validationResult } from "express-validator";

/**
 * Common error handler for express-validator
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(400).json({
      success: false,
      error: "Bad Request",
      message: errorMessages.join(". "),
    });
  }
  next();
};

/**
 * @constant blogDetailByHashValidator
 * @description Validates the :hash param for GET /api/blog-details/:hash
 */
export const blogDetailByHashValidator = [
  param("blog_detail_hash")
    .notEmpty()
    .withMessage("Blog detail hash is required.")
    .isString()
    .withMessage("Blog detail hash must be a string.")
    .isLength({ max: 255 })
    .withMessage("Blog detail hash must not exceed 255 characters.")
    .trim(),
  handleValidationErrors,
];

/**
 * @constant createBlogDetailValidator
 * @description Middleware array for validating the provided blog detail creation payload.
 */
export const createBlogDetailValidator = [
  // Validate blog_id
  body("blog_id")
    .notEmpty()
    .withMessage("Blog ID is required.")
    .isInt({ min: 1 })
    .withMessage("Blog ID must be a positive integer.")
    .toInt(),
  // Validate detail_description
  body("detail_description")
    .notEmpty()
    .withMessage("Detail description is required.")
    .isString()
    .withMessage("Detail description must be a string."),

  // Validate blog_main_highlight
  body("blog_main_highlight")
    .notEmpty()
    .withMessage("Blog main highlight is required.")
    .isString()
    .withMessage("Blog main highlight must be a string."),

  // Validate blog_post_wrap_up
  body("blog_post_wrap_up")
    .notEmpty()
    .withMessage("Blog post wrap-up is required.")
    .isString()
    .withMessage("Blog post wrap-up must be a string."),

  // Validate tags array
  body("tags")
    .isArray({ min: 1 })
    .withMessage("Tags must be a non-empty array."),
  body("tags.*.tag_id")
    .isInt({ min: 1 })
    .withMessage("Each tag_id must be a positive integer.")
    .toInt(),

  // Validate images array
  body("images")
    .isArray({ min: 1 })
    .withMessage("Images must be a non-empty array."),
  body("images.*.blog_img_url")
    .notEmpty()
    .withMessage("Image URL cannot be empty.")
    .isURL()
    .withMessage("Each blog_img_url must be a valid URL."),

  // Validate optional related_blog_post array
  body("related_blog_post")
    .optional() // This makes the entire field optional
    .isArray()
    .withMessage("Related blog posts must be an array."),
  body("related_blog_post.*.blog_id")
    .isInt({ min: 1 })
    .withMessage("Each related blog_id must be a positive integer.")
    .toInt(),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: errorMessages.join(". "),
      });
    }
    next();
  },
];

/**
 * @constant updateBlogDetailValidator
 * @description Validates PATCH /api/blog-details/:blog_detail_hash with optional fields.
 */
export const updateBlogDetailValidator = [
  param("blog_detail_hash")
    .notEmpty()
    .withMessage("Blog detail hash is required.")
    .isString()
    .withMessage("Blog detail hash must be a string.")
    .isLength({ max: 255 })
    .withMessage("Blog detail hash must not exceed 255 characters.")
    .trim(),

  // Optional base fields
  body("blog_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("blog_id must be a positive integer.")
    .toInt(),

  body("detail_description")
    .optional()
    .isString()
    .withMessage("detail_description must be a string."),

  body("blog_main_highlight")
    .optional()
    .isString()
    .withMessage("blog_main_highlight must be a string."),

  body("blog_post_wrap_up")
    .optional()
    .isString()
    .withMessage("blog_post_wrap_up must be a string."),

  // Optional full-replacement arrays
  body("tags").optional().isArray().withMessage("tags must be an array."),
  body("tags.*.tag_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Each tag_id must be a positive integer.")
    .toInt(),

  body("images").optional().isArray().withMessage("images must be an array."),
  body("images.*.blog_img_url")
    .optional()
    .notEmpty()
    .withMessage("blog_img_url cannot be empty.")
    .isURL()
    .withMessage("Each blog_img_url must be a valid URL."),

  body("related_blog_posts")
    .optional()
    .isArray()
    .withMessage("related_blog_posts must be an array."),
  body("related_blog_posts.*.blog_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Each related blog_id must be a positive integer.")
    .toInt(),

  handleValidationErrors,
];


