const { body, validationResult } = require("express-validator");

const validate = (rules) => async (req, res, next) => {
  await Promise.all(rules.map((rule) => rule.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      EC: 1,
      EM: "Validation failed",
      errors: errors.array().map(({ msg, param, value }) => ({ param, msg, value })),
    });
  }

  next();
};

const registerRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be at least 6 characters"),
];

const forgotPasswordRules = [
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),
];

const updateProfileRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("phone")
    .optional()
    .trim()
    .isLength({ min: 6, max: 30 })
    .withMessage("Phone must be between 6 and 30 characters")
    .matches(/^[0-9+()\- ]*$/)
    .withMessage("Phone contains invalid characters"),
  body("address")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Address can be at most 200 characters"),
  body("avatar")
    .optional()
    .trim()
    .isURL()
    .withMessage("Avatar must be a valid URL"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Bio can be at most 300 characters"),
  body("dateOfBirth")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Date of birth must be a valid ISO date"),
  body("gender")
    .optional()
    .trim()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  forgotPasswordRules,
  updateProfileRules,
};
