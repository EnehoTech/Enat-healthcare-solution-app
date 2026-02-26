import { body, param, validationResult } from "express-validator";

/* @constant createServiceValidator
 * @description Middleware array for validating service creation requests.
 */
export const createServiceValidator = [
  body("icon_class_name")
    .notEmpty()
    .withMessage("Service icon is required.")
    .isString()
    .withMessage("Service icon must be a valid string."),
  body("service_title")
    .notEmpty()
    .withMessage("Service title is required.")
    .isString()
    .withMessage("Service title must be a string.")
    .isLength({ max: 255 })
    .withMessage("Service title must not exceed 255 characters."),
  body("service_subtitle")
    .trim()
    .notEmpty()
    .withMessage("Service subtitle is required")
    .isString()
    .withMessage("Must be a string")
    .isLength({ max: 255 })
    .withMessage("Subtitle cannot exceed 255 characters"),
  body("service_description")
    .notEmpty()
    .withMessage("Service description is required.")
    .isString()
    .withMessage("Service description must be a string."),
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

/* @constant updateServiceByIdValidator
 * @description Middleware array for validating service update requests.
 */
export const updateServiceByIdValidator = [
  param("service_id")
    .isInt({ min: 1 })
    .withMessage("Service ID must be a positive integer.")
    .notEmpty()
    .withMessage("Service ID is required."),

  body("icon_class_name")
    .optional()
    .isString()
    .withMessage("Service icon must be a valid string."),
  body("service_title")
    .optional() // Changed to optional as it's an update, unless you require all fields
    .isString()
    .withMessage("Service title must be a string.")
    .isLength({ max: 255 })
    .withMessage("Service title must not exceed 255 characters."),
  body("service_subtitle")
    .optional()
    .trim()
    .isString()
    .withMessage("Must be a string")
    .isLength({ max: 255 })
    .withMessage("Subtitle cannot exceed 255 characters"),
  body("service_description")
    .optional() // Changed to optional as it's an update, unless you require all fields
    .isString()
    .withMessage("Service description must be a string."),
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
 * @constant serviceIdValidator
 * @description Middleware for validating service ID in request parameters.
 */
export const serviceIdValidator = [
  param("service_id")
    .isInt({ min: 1 })
    .withMessage("Service ID must be a positive integer.")
    .notEmpty()
    .withMessage("Service ID is required."),
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

