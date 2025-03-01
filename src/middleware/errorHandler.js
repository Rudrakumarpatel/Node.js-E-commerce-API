// Global Error Handling Middleware
module.exports = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
      message: err.message || "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};
