import { body, param, validationResult } from "express-validator";

export const faqIdValidator = [
  param("faq_id")
    .isInt({ min: 1 })
    .withMessage("FAQ ID must be a positive integer."),
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

export const createFaqValidator = [
  body("faq_question")
    .notEmpty()
    .withMessage("FAQ question is required.")
    .isString()
    .withMessage("FAQ question must be a string."),
  body("faq_answer")
    .notEmpty()
    .withMessage("FAQ answer is required.")
    .isString()
    .withMessage("FAQ answer must be a string."),
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

export const updateFaqValidator = [
  param("faq_id")
    .isInt({ min: 1 })
    .withMessage("FAQ ID must be a positive integer."),
  body("faq_question")
    .notEmpty()
    .withMessage("FAQ question is required.")
    .isString()
    .withMessage("FAQ question must be a string."),
  body("faq_answer")
    .notEmpty()
    .withMessage("FAQ answer is required.")
    .isString()
    .withMessage("FAQ answer must be a string."),
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
