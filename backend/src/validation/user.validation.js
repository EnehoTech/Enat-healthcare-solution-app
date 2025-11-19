import { param, validationResult } from "express-validator";

/**
 * Validation rules for the get single user by ID endpoint.
 */
export const getUserByIdValidator = [
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

/**
 * @constant userRoleIdValidator
 * @description Middleware array for validating the user_role_id parameter in requests.
 * Ensures that the user_role_id provided in the request parameters is a valid integer.
 * If validation fails, a BadRequestError is returned with the appropriate error message(s).
 * @example
 * app.get('/users/assign-role/:user_role_id', userRoleIdValidator, getUserRoleByIdController);
 */
export const userRoleIdValidator = [
  param("user_role_id")
    .isInt({ min: 1 }) // Ensures user_role_id is an integer and >= 1
    .withMessage("User Role ID must be a positive integer."),

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
 * @constant userProfilePictureIdValidator
 * @description Middleware array for validating the user_profile_picture_id parameter in requests.
 * Ensures that the user_profile_picture_id provided in the request parameters is a valid integer.
 * If validation fails, a BadRequestError is thrown with the appropriate error message(s).
 * @example
 * app.get('/users/avatar/:user_profile_picture_id', userProfilePictureIdValidator, getUserProfilePictureController);
 */
export const userProfilePictureByIdValidator = [
  param("avatar_id")
    .isInt({ min: 1 }) // Ensures user_profile_picture_id is a positive integer
    .withMessage("User Profile Picture ID must be a positive integer."),

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

