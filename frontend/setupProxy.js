const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: `${process.env.REACT_APP_BACKEND_URL}`, // Use environment variable or default to localhost",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "", // Remove /api prefix when forwarding to backend
      },
    })
  );
};
