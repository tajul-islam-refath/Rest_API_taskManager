const express = require("express");
const app = express();

// import security middleware
const morgan = require("morgan");
const bodyParser = require("body-parser");
const rateLimiter = require("express-rate-limit");
const cors = require("cors");
const hpp = require("hpp");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

// security middleware implementation
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Setup api rate limits
const limits = rateLimiter({
  windowMs: 15 * 60 * 60 * 1000,
  max: 100,
});

app.use(limits);

// import router
const router = require("./src/routes/index");

// implementation router
app.use("/api/v1", router);

module.exports = app;
