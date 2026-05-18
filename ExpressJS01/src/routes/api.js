const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  getProfile,
  updateProfile,
  forgotPassword,
} = require("../controllers/userController");
const {
  getProducts,
  getProductHighlights,
  getProductDetail,
  getCategories,
} = require("../controllers/productController");
const {
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} = require("../controllers/adminController");
const { auth, authorizeRoles } = require("../middleware/auth");
const {
  validate,
  registerRules,
  loginRules,
  forgotPasswordRules,
  updateProfileRules,
} = require("../middleware/validation");
const { authLimiter } = require("../middleware/rateLimiter");
const delay = require("../middleware/delay");

const routerAPI = express.Router();

routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});

routerAPI.post("/register", authLimiter, validate(registerRules), createUser);
routerAPI.post("/login", authLimiter, validate(loginRules), handleLogin);
routerAPI.post("/forgot-password", authLimiter, validate(forgotPasswordRules), forgotPassword);

routerAPI.get("/products", getProducts);
routerAPI.get("/products/highlights", getProductHighlights);
routerAPI.get("/products/:slug", getProductDetail);
routerAPI.get("/categories", getCategories);

routerAPI.use(auth);

routerAPI.get("/user", authorizeRoles("admin", "manager"), getUser);
routerAPI.get("/account", delay, getAccount);
routerAPI.get("/profile", getProfile);
routerAPI.put("/profile", validate(updateProfileRules), updateProfile);

routerAPI.get("/admin/users", authorizeRoles("admin"), getAdminUsers);
routerAPI.put("/admin/users/:id", authorizeRoles("admin"), updateAdminUser);
routerAPI.delete("/admin/users/:id", authorizeRoles("admin"), deleteAdminUser);

routerAPI.get("/admin/products", authorizeRoles("admin"), getAdminProducts);
routerAPI.post("/admin/products", authorizeRoles("admin"), createAdminProduct);
routerAPI.put("/admin/products/:id", authorizeRoles("admin"), updateAdminProduct);
routerAPI.delete("/admin/products/:id", authorizeRoles("admin"), deleteAdminProduct);

module.exports = routerAPI;
