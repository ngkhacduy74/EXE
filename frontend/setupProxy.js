const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Proxy all API calls to backend
  app.use(
    ["/auth", "/otp", "/user", "/product", "/post", "/file", "/chat", "/banner"],
    createProxyMiddleware({
      target: process.env.REACT_APP_BACKEND_URL || "http://localhost:4000",
      changeOrigin: true,
      logLevel: 'debug', // Add logging for debugging
    })
  );
};
