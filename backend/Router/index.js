const authRouter = require("./auth.route");
const fileRouter = require("./file.router");
module.exports = (app) => {
  app.use("/auth", authRouter);
  app.use("/file", fileRouter);
};
