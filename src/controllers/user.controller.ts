import { RequestHandler } from 'express';
import HttpStatus, { getReasonPhrase } from 'http-status-codes';
import User from '../models/user.model';
import { UnauthorizedError } from '../utils/AppError';
import { getUserDTO } from '../DTO/user.dto';

export const fetchUserProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Please logIn again');
    }
    const user: getUserDTO = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phone: req.user.phone,
      address: req.user.address,
      birthDate: req.user.birthDate,
    };
    res.status(HttpStatus.OK).json({
      status: getReasonPhrase(HttpStatus.OK),
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserProfile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Please set up a valid authentication token');
    }
    const allowedFields = ['firstName', 'lastName', 'phone', 'address'];
    const newUserData = { ...req.user, ...req.body };

    // TODO: USE A MAPPER INSTEAD OF HARD CODING
    const updateData = {
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      phone: newUserData.phone,
      address: newUserData.address,
    };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select(
      allowedFields.join(' ')
    );
    res.status(HttpStatus.OK).json({
      status: getReasonPhrase(HttpStatus.OK),
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

// TODO: FINISH THE CRUD
export const fetchAll: RequestHandler = (_req, res, _next) => {
  res.status(200).json({});
};
export const fetch: RequestHandler = (_req, res, _next) => {
  res.status(HttpStatus.OK).json({});
};
export const create: RequestHandler = (_req, res, _next) => {
  res.status(HttpStatus.CREATED).json({});
};
export const update: RequestHandler = (_req, res, _next) => {
  res.status(HttpStatus.OK).json({});
};
export const remove: RequestHandler = (_req, res, _next) => {
  res.status(HttpStatus.NO_CONTENT).json({});
};
