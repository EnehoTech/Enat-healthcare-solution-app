import { body, param, validationResult } from "express-validator";

/**
 * @description Middleware to process validation results and return a formatted 400 error if any exist.
 */
const handleValidation = (req, res, next) => {
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
};

/** @constant createSocialHandleValidator */
export const createSocialHandleValidator = [
  body("doctor_id").isInt({ min: 1 }).withMessage("Doctor ID is required."),
  body("smp_id")
    .isInt({ min: 1 })
    .withMessage("Valid Platform ID (smp_id) is required."),
  body("handle_link").isURL().withMessage("Valid URL required."),
  handleValidation,
];

/** @constant updateSocialHandleValidator */
export const updateSocialHandleValidator = [
  param("handle_id").isInt({ min: 1 }).withMessage("Valid Handle ID required."),
  body("smp_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("smp_id must be a number."),
  body("handle_link").optional().isURL().withMessage("Valid URL required."),
  handleValidation,
];


/** @constant handleIdValidator */
export const handleIdValidator = [
  param("handle_id").isInt({ min: 1 }).withMessage("Valid Handle ID required."),
  handleValidation,
];
