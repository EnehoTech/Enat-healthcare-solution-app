import { body, validationResult } from "express-validator";

/**
 * @constant createAccountValidator
 * @description Middleware array for validating user creation requests.
 * Validates fields such as email, password, and username.
 * @example
 * app.post('/users', createAccountValidator, createUserController);
 */
export const createAccountValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email must be valid.")
    .isLength({ max: 50 })
    .withMessage("Email must not exceed 50 characters.")
    .normalizeEmail(),

  body("first_name").trim().notEmpty().withMessage("First name is required."),

  body("last_name").trim().notEmpty().withMessage("Last name is required."),

  body("phone_number")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .matches(/^[0-9]{9,15}$/)
    .withMessage("Phone number must be between 9 and 15 digits."),
  body("password")
    .isString()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/(?=.*[0-9])/)
    .withMessage("Password must contain a number.")
    .matches(/(?=.*[a-zA-Z])/)
    .withMessage("Password must contain a letter.")
    .matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage("Password must contain a special character."),

  // Custom validation handler to capture errors
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
 * @constant signInValidator
 * @description Middleware array for validating user sign-in requests.
 * Validates email and password fields with specific criteria.
 * @example
 * app.post('/sign-in', signInValidator, signInController);
 */
export const signInValidator = [
  // Email validation
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  // Password validation
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/(?=.*[0-9])/)
    .withMessage("Password must contain at least one number.")
    .matches(/(?=.*[a-zA-Z])/)
    .withMessage("Password must contain at least one letter.")
    .matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage("Password must contain at least one special character."),

  // Middleware to check validation results
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
