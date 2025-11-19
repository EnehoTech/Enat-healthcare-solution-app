import { body, param, validationResult } from "express-validator";

/**
 * @constant createRoleValidator
 * @description Middleware array for validating role creation requests.
 * Validates fields such as name and description.
 * @example
 * app.post('/roles', createRoleValidator, createRoleController);
 */
export const createRoleValidator = [
  body("app_role_name")
    .trim()
    .notEmpty()
    .withMessage("Role name is required.")
    .isLength({ max: 50 })
    .withMessage("Role name must not exceed 50 characters."),

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
 * @constant roleIdValidator
 * @description Middleware array for validating the roleId parameter in requests.
 * Ensures that the roleId provided in the request parameters is a valid integer.
 * If validation fails, a BadRequestError is thrown with the appropriate error message(s).
 * @example
 * app.get('/roles/:roleId', roleIdValidator, getRoleByIdController);
 */
export const roleIdValidator = [
  param("app_role_id")
    .isInt({ min: 0 }) // Ensures roleId is an integer and >= 0
    .withMessage("Role ID must be an integer."),

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
 * @constant updateRoleValidator
 * @description Middleware array for validating role update requests.
 * Validates fields such as roleId, name, and description.
 * @example
 * app.patch('/roles/:roleId', updateRoleValidator, updateRoleController);
 */
export const updateRoleValidator = [
  param("app_role_id").isInt().withMessage("Role ID must be an integer"),

  body("app_role_name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Role name cannot be empty.")
    .isLength({ max: 50 })
    .withMessage("Role name must not exceed 50 characters."),

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


