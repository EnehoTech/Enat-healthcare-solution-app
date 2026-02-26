import { body, param, validationResult } from "express-validator";

/**
 * @constant createTestimonialValidator
 * @description Middleware array for validating testimonial creation requests.
 */
export const createTestimonialValidator = [
  body("testimonial_text")
    .notEmpty()
    .withMessage("Testimonial text is required.")
    .isString()
    .withMessage("Testimonial text must be a string."),
  body("full_name")
    .notEmpty()
    .withMessage("Full name is required.")
    .isString()
    .withMessage("Full name must be a valid string.")
    .isLength({ max: 255 })
    .withMessage("Full name must not exceed 255 characters."),
  body("job_title")
    .notEmpty()
    .withMessage("Job title is required.")
    .isString()
    .withMessage("Job title must be a valid string.")
    .isLength({ max: 255 })
    .withMessage("Job title must not exceed 255 characters."),
  body("testifier_avatar")
    .optional()
    .isString()
    .withMessage("Testifier avatar must be a valid string."),
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
 * @constant updateTestimonialByIdValidator
 * @description Middleware array for validating testimonial update requests.
 */
export const updateTestimonialByIdValidator = [
  param("testimonial_id")
    .isInt({ min: 1 })
    .withMessage("Testimonial ID must be a positive integer.")
    .notEmpty()
    .withMessage("Testimonial ID is required."),
  body("testimonial_text")
    .notEmpty()
    .withMessage("Testimonial text is required.")
    .isString()
    .withMessage("Testimonial text must be a string."),
  body("full_name")
    .notEmpty()
    .withMessage("Full name is required.")
    .isString()
    .withMessage("Full name must be a valid string.")
    .isLength({ max: 255 })
    .withMessage("Full name must not exceed 255 characters."),
  body("job_title")
    .notEmpty()
    .withMessage("Job title is required.")
    .isString()
    .withMessage("Job title must be a valid string.")
    .isLength({ max: 255 })
    .withMessage("Job title must not exceed 255 characters."),
  body("testifier_avatar")
    .optional()
    .isString()
    .withMessage("Testifier avatar must be a valid string."),
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
 * @constant testimonialIdValidator
 * @description Middleware for validating testimonial ID in request parameters.
 */
export const testimonialIdValidator = [
  param("testimonial_id")
    .isInt({ min: 1 })
    .withMessage("Testimonial ID must be a positive integer."),
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
