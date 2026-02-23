import { body, param, validationResult } from "express-validator";

/**
 * @constant createBlogValidator
 * @description Middleware array for validating blog creation requests.
 */
export const createBlogValidator = [
  body("image_gallery_id")
    .notEmpty()
    .withMessage("Image Gallery ID is required.")
    .isInt({ min: 1 })
    .withMessage("Image Gallery ID must be a positive integer."),
  body("blog_title")
    .notEmpty()
    .withMessage("Blog title is required.")
    .isLength({ max: 255 })
    .withMessage("Blog title must not exceed 255 characters."),
  body("blog_description")
    .notEmpty()
    .withMessage("Blog description is required.")
    .isString()
    .withMessage("Blog description must be a string."),
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
 * @constant updateBlogValidator
 * @description Middleware array for validating blog update requests.
 */
export const updateBlogValidator = [
  // Validate the blog ID from the route parameter
  param("blog_id")
    .isInt({ min: 1 })
    .withMessage("Blog ID must be a positive integer.")
    .notEmpty()
    .withMessage("Blog ID is required."),
  body("image_gallery_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Image Gallery ID must be a positive integer."),
  // Validate blog title
  body("blog_title")
    .notEmpty()
    .withMessage("Blog title is required.")
    .isString()
    .withMessage("Blog title must be a string.")
    .isLength({ max: 255 })
    .withMessage("Blog title must not exceed 255 characters."),

  // Validate blog description
  body("blog_description")
    .notEmpty()
    .withMessage("Blog description is required.")
    .isString()
    .withMessage("Blog description must be a string."),
  // Middleware to handle validation results
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
 * @constant blogIdValidator
 * @description Middleware for validating blog ID in request parameters.
 */
export const blogIdValidator = [
  param("blog_id").isInt().withMessage("Blog ID must be a positive integer"),
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
 * Validation rules for the get single blog by user ID endpoint.
 */
export const getBlogByUserIdValidator = [
  // Validate that user_id is a positive integer
  param("user_id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer."),

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
