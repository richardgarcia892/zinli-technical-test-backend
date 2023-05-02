import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export class AppError extends Error {
  public readonly reponseStatusCode: number;
  public readonly reponseStatusMessage: string;
  public readonly customMessage: string;
  public readonly isOperational: boolean;
  public readonly originalError?: Error;

  constructor(customMessage: string, statusCode: number, originalError?: Error) {
    super(originalError?.message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.reponseStatusCode = statusCode;
    this.reponseStatusMessage = getReasonPhrase(statusCode);
    this.isOperational = true;
    this.customMessage = customMessage;
    this.originalError = originalError;

    Error.captureStackTrace(this);
  }
}

export class BadRequestError extends AppError {
  public customMessage: string;
  constructor(customMessge: string, originalError?: Error) {
    super(customMessge, StatusCodes.BAD_REQUEST, originalError);
    if (originalError) {
      this.customMessage = originalError?.message;
    } else {
      this.customMessage = customMessge;
    }
  }
}

export class NotFoundError extends AppError {
  constructor(customMessge: string, originalError?: Error) {
    super(customMessge, StatusCodes.BAD_REQUEST, originalError);
  }
}

export class DuplicatedError extends AppError {
  constructor(customMessge: string, originalError?: Error) {
    super(customMessge, StatusCodes.BAD_REQUEST, originalError);
  }
}
export class UnauthorizedError extends AppError {
  constructor(customMessge: string, originalError?: Error) {
    super(customMessge, StatusCodes.UNAUTHORIZED, originalError);
  }
}
