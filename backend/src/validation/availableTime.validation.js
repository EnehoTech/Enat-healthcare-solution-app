import { body, param, validationResult } from "express-validator";

/**
 * @constant validateResult
 * @description Helper middleware to handle validation result errors consistently.
 */
const validateResult = (req, res, next) => {
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

/**
 * @constant availableTimeIdValidator
 * @description Validates the available_time_id (or id) in the URL parameters.
 */
export const availableTimeIdValidator = [
  param("available_time_id")
    .isInt({ min: 1 })
    .withMessage("Available time ID must be a positive integer."),
  validateResult,
];

/**
 * @constant createAvailableTimeValidator
 * @description Validates data for creating a recurring weekly availability block.
 */
export const createAvailableTimeValidator = [
  body("doctor_id")
    .notEmpty()
    .withMessage("Doctor ID is required.")
    .isInt({ min: 1 })
    .withMessage("Doctor ID must be a positive integer."),
  body("day_of_week")
    .notEmpty()
    .withMessage("Day of week is required.")
    .isInt({ min: 0, max: 6 })
    .withMessage("Day of week must be between 0 (Sunday) and 6 (Saturday)."),
  body("start_time")
    .notEmpty()
    .withMessage("Start time is required.")
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .withMessage("Start time must be in HH:mm:ss format."),
  body("end_time")
    .notEmpty()
    .withMessage("End time is required.")
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .withMessage("End time must be in HH:mm:ss format.")
    .custom((value, { req }) => {
      if (value <= req.body.start_time) {
        throw new Error("End time must be after start time.");
      }
      return true;
    }),
  body("slot_duration_min")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Slot duration must be a positive integer."),
  body("buffer_before_min")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Buffer before must be a non-negative integer."),
  body("buffer_after_min")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Buffer after must be a non-negative integer."),
  body("effective_from")
    .notEmpty()
    .withMessage("Effective from date is required.")
    .isDate()
    .withMessage("Effective from must be a valid date (YYYY-MM-DD)."),
  body("effective_to")
    .optional({ nullable: true })
    .isDate()
    .withMessage("Effective to must be a valid date (YYYY-MM-DD)."),
  validateResult,
];

/**
 * @constant updateAvailableTimeValidator
 * @description Validates partial updates for an existing availability block.
 */
export const updateAvailableTimeValidator = [
  param("available_time_id")
    .isInt({ min: 1 })
    .withMessage("Available time ID must be a positive integer."),
  body("doctor_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Doctor ID must be a positive integer."),

  body("day_of_week")
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage("Day of week must be between 0 (Sunday) and 6 (Saturday)."),
  body("start_time")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .withMessage("Start time must be in HH:mm:ss format."),
  body("end_time")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .withMessage("End time must be in HH:mm:ss format."),
  body("slot_duration_min")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Slot duration must be a positive integer."),
  body("effective_to")
    .optional({ nullable: true })
    .isDate()
    .withMessage("Effective to must be a valid date."),
  validateResult,
];
