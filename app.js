const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const app = express();
const contactsRouter = require("./routes/api/contacts");
const UserRouter = require("./routes/api/user");
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

require("./config/config-passport");
app.use("/api/contacts", contactsRouter);
app.use("/api/users", UserRouter);

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

module.exports = app;
