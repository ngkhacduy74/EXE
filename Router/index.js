const authRouter = require("./auth.router");
const fileRouter = require("./file.router");
module.exports = (app) => {
  app.use("/auth", authRouter);
  app.use("/file", fileRouter);
};
