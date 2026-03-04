import { body, param, validationResult } from "express-validator";

/**
 * @constant doctorIdValidator
 * @description Validates the doctor_id in the URL parameters.
 */
export const doctorIdValidator = [
  param("doctor_id")
    .isInt({ min: 1 })
    .withMessage("Doctor ID must be a positive integer."),
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
 * @constant createDoctorValidator
 * @description Validates doctor creation data including user and department linking.
 */
export const createDoctorValidator = [
  body("user_id")
    .notEmpty()
    .withMessage("User ID is required.")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer."),
  body("department_id")
    .notEmpty()
    .withMessage("Department ID is required.")
    .isInt({ min: 1 })
    .withMessage("Department ID must be a positive integer."),
  body("doctor_specialty")
    .notEmpty()
    .withMessage("Doctor specialty is required.")
    .isString()
    .withMessage("Doctor specialty must be a string.")
    .isLength({ max: 255 })
    .withMessage("Specialty must not exceed 255 characters."),
  body("doctor_description")
    .notEmpty()
    .withMessage("Doctor description is required.")
    .isString()
    .withMessage("Description must be a string."),
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
 * @constant updateDoctorValidator
 * @description Validates partial updates for doctor profile.
 */
export const updateDoctorValidator = [
  param("doctor_id")
    .isInt({ min: 1 })
    .withMessage("Doctor ID must be a positive integer."),
  body("department_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Department ID must be a positive integer."),
  body("doctor_specialty")
    .optional()
    .isString()
    .withMessage("Doctor specialty must be a string.")
    .isLength({ max: 255 })
    .withMessage("Specialty must not exceed 255 characters."),
  body("doctor_description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
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
