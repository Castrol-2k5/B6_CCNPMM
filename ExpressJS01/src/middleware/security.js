require("dotenv").config();

const defaultOrigins = ["http://localhost:3000", "http://localhost:5173"];
const trustedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : defaultOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests like Postman or server-to-server calls
    if (!origin || trustedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS policy: origin not allowed"), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

const setSecurityHeaders = (req, res, next) => {
  res.set({
    "X-DNS-Prefetch-Control": "off",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  });
  next();
};

const enforceHttps = (req, res, next) => {
  if (process.env.NODE_ENV === "production" || process.env.ENFORCE_HTTPS === "true") {
    const forwardedProto = req.headers["x-forwarded-proto"];
    const protocol = forwardedProto || req.protocol;

    if (protocol !== "https") {
      return res.status(426).json({
        EC: 1,
        EM: "Please use HTTPS for this request.",
      });
    }
  }

  return next();
};

module.exports = {
  corsOptions,
  setSecurityHeaders,
  enforceHttps,
};
