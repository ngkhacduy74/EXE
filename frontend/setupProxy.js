const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_BACKEND_URL || "http://localhost:4000", // Use environment variable or default to localhost
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api", // Keep /api prefix when forwarding to backend
      },
    })
  );
};
