export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string) {
    return new ApiError(400, message);
  }

  static unauthorized(message: string) {
    return new ApiError(401, message);
  }

  static forbidden(message: string) {
    return new ApiError(403, message);
  }

  static notFound(message: string) {
    return new ApiError(404, message);
  }

  static internal(message: string) {
    return new ApiError(500, message, false);
  }
}
