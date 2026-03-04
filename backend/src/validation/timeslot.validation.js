import { body, param, query, validationResult } from "express-validator";

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

export const timeslotIdValidator = [
  param("timeslot_id")
    .isInt({ min: 1 })
    .withMessage("Timeslot ID must be a positive integer."),
  validateResult,
];

/**
 * Validation for the Generate process.
 * Note: from_date/to_date are range inputs to calculate start_datetime/end_datetime.
 */
export const generateTimeslotsValidator = [
  body("doctor_id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("Doctor ID is required."),
  body("from_date")
    .isDate()
    .withMessage("Valid from_date (YYYY-MM-DD) is required."),
  body("to_date")
    .isDate()
    .withMessage("Valid to_date (YYYY-MM-DD) is required."),
  validateResult,
];

export const updateTimeslotStatusValidator = [
  param("timeslot_id")
    .isInt({ min: 1 })
    .withMessage("Timeslot ID must be a positive integer."),
  body("status")
    .optional({ nullable: true })
    .isIn(["OPEN", "HELD", "BOOKED", "CANCELLED"])
    .withMessage("Status must be OPEN, HELD, BOOKED, or CANCELLED."),
  body("hold_expires_at")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Hold expiration must be a valid datetime."),
  validateResult,
];

export const getTimeslotsQueryValidator = [
  query("doctor_id").optional().isInt({ min: 1 }),
  query("status").optional().isIn(["OPEN", "HELD", "BOOKED", "CANCELLED"]),
  validateResult,
];
