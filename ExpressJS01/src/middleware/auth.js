require("dotenv").config();
const jwt = require("jsonwebtoken");

const normalizeRole = (role) => {
  if (!role || role === "member") {
    return "user";
  }

  return role;
};

const auth = (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")?.[1];

  if (!token) {
    return res.status(401).json({
      EC: 1,
      EM: "Authentication token is required.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = {
      _id: decoded._id,
      email: decoded.email,
      name: decoded.name,
      role: normalizeRole(decoded.role),
    };
    next();
  } catch (error) {
    return res.status(401).json({
      EC: 1,
      EM: "Token expired or invalid.",
    });
  }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      EC: 1,
      EM: "Ban chua dang nhap",
    });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      EC: 1,
      EM: "Ban khong co quyen truy cap chuc nang nay",
    });
  }

  next();
};

module.exports = {
  auth,
  authorizeRoles,
  normalizeRole,
};
