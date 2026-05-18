const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    EC: 1,
    EM: "Too many requests from this IP, please try again later.",
  },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    EC: 1,
    EM: "Too many requests from this IP, please try again later.",
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};
