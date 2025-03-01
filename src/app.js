const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

app.use(errorHandler);

module.exports = app;
