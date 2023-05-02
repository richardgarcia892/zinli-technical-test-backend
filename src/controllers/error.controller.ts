import { ErrorRequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export const AppErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err.isOperational)
    return res.status(err.reponseStatusCode).json({
      status: err.reponseStatusMessage,
      message: err.customMessage,
    });
  next(err);
};

export const InternalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.log('InternalErrorHandler');
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    message: err.cus,
    stack: err.stack,
  });
};
