require("dotenv").config();
const express = require("express");
const cors = require("cors");
const configViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/api");
const connection = require("./config/database");
const { getHomepage } = require("./controllers/homeController");
const { seedAdminIfNeeded } = require("./services/adminService");
const { corsOptions, setSecurityHeaders, enforceHttps } = require("./middleware/security");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();
const port = process.env.PORT || 8888;

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(setSecurityHeaders);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(enforceHttps);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(apiLimiter);

configViewEngine(app);

const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use("/", webAPI);

app.use("/v1/api/", apiRoutes);

(async () => {
  try {
    await connection();
    await seedAdminIfNeeded();

    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
