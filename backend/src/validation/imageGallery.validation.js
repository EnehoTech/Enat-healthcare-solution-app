import { body, param, validationResult } from "express-validator";
/**
 * @constant getImagesByUserIdValidator
 */
export const getImagesByUserIdValidator = [
  param("user_id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: errors
          .array()
          .map((err) => err.msg)
          .join(". "),
      });
    }
    next();
  },
];
/**
 * @constant imageGalleryIdValidator
 */
export const imageGalleryIdValidator = [
  param("image_gallery_id")
    .isInt({ min: 1 })
    .withMessage("Image Gallery ID must be a positive integer."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: errors
          .array()
          .map((err) => err.msg)
          .join(". "),
      });
    }
    next();
  },
];

/**
 * @constant createImageGalleryValidator
 */
export const createImageGalleryValidator = [
  body("image_name")
    .notEmpty()
    .withMessage("Image name is required.")
    .isString()
    .withMessage("Image name must be a string.")
    .isLength({ max: 255 })
    .withMessage("Image name must not exceed 255 characters."),
  body("image_url")
    .optional()
    .isString()
    .withMessage("Image URL must be a valid string."),
  body("image_type")
    .notEmpty()
    .withMessage("Image type is required.")
    .isIn(["BLOG", "BLOG_DETAIL"])
    .withMessage("Type must be either BLOG or BLOG_DETAIL."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: errors
          .array()
          .map((err) => err.msg)
          .join(". "),
      });
    }
    next();
  },
];

/**
 * @constant updateImageGalleryValidator
 * @description Middleware array for validating image gallery update requests.
 */
export const updateImageGalleryValidator = [
  // 1. Validate the ID in the URL parameters
  param("image_gallery_id")
    .isInt({ min: 1 })
    .withMessage("Image Gallery ID must be a positive integer.")
    .notEmpty()
    .withMessage("Image Gallery ID is required."),

  // 2. Validate the image name (Optional in PATCH)
  body("image_name")
    .optional()
    .isString()
    .withMessage("Image name must be a string.")
    .isLength({ max: 255 })
    .withMessage("Image name must not exceed 255 characters."),

  // 3. Validate the image type (Optional in PATCH)
  body("image_type")
    .optional()
    .isIn(["BLOG", "BLOG_DETAIL"])
    .withMessage("Image type must be either 'BLOG' or 'BLOG_DETAIL'."),

  // 4. Validate image_url (Optional, usually handled by file upload logic)
  body("image_url")
    .optional()
    .isString()
    .withMessage("Image URL must be a valid string."),

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
