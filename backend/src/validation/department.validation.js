import { body, param, validationResult } from "express-validator";

/**
 * @constant createDepartmentValidator
 * @description Middleware array for validating department creation requests.
 * @example
 * router.post('/departments', createDepartmentValidator, createDepartmentController);
 */
export const createDepartmentValidator = [
  body("department_name")
    .trim()
    .notEmpty()
    .withMessage("Department name is required.")
    .isLength({ max: 255 })
    .withMessage("Department name must not exceed 255 characters."),

  body("department_description")
    .trim()
    .notEmpty()
    .withMessage("Department description is required.")
    .isLength({ max: 255 })
    .withMessage("Description must not exceed 255 characters."),

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
 * @constant departmentIdValidator
 * @description Ensures Department_id is a valid integer.
 */
export const departmentIdValidator = [
  param("Department_id")
    .isInt({ min: 1 })
    .withMessage("Department ID must be a positive integer."),

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
 * @constant updateDepartmentValidator
 * @description Validates ID in param and optional fields in body.
 */
export const updateDepartmentValidator = [
  param("Department_id")
    .isInt({ min: 1 })
    .withMessage("Department ID must be a valid integer."),

  body("department_name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Department name cannot be empty.")
    .isLength({ max: 255 })
    .withMessage("Department name must not exceed 255 characters."),

  body("department_description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Department description cannot be empty."),

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
