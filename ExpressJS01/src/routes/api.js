const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  forgotPassword,
} = require("../controllers/userController");
const {
  getProducts,
  getProductDetail,
  getCategories,
} = require("../controllers/productController");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");

const routerAPI = express.Router();

routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", forgotPassword);

routerAPI.get("/products", getProducts);
routerAPI.get("/products/:slug", getProductDetail);
routerAPI.get("/categories", getCategories);

routerAPI.use(auth);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI;
