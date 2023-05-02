import { RequestHandler, Request } from 'express';
import { BadRequestError } from '../utils/AppError';
import Joi, { ValidationResult } from 'joi';

export const validatorHandler = (schema: Joi.Schema, property: keyof Request): RequestHandler => {
  return async (req, _res, next) => {
    try {
      const data = req[property];
      const validation: ValidationResult = await schema.validateAsync(data, { abortEarly: false });
      req.body = validation;
      next();
    } catch (err) {
      next(new BadRequestError('Validatio error', err as Error));
    }
  };
};
