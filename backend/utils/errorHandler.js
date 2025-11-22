class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorTypes = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const handleError = (res, error, defaultStatusCode = 500) => {
  const statusCode = error.statusCode || defaultStatusCode;
  const message = error.message || "Something went wrong";

  console.error(`[${statusCode}] ${message}:`, error);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

module.exports = {
  AppError,
  errorTypes,
  handleError,
};