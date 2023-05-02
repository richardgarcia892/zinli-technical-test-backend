import { RequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { newUserResponseDTO } from '../DTO/auth.dto';
import { NotFoundError, UnauthorizedError } from '../utils/AppError';
import sendEmail, { MailOptions, sendPasswordRecoveryEmail, sendVerificationEmail } from '../utils/mailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { JwtPayloadI, JWT_EXPIRES_IN, JWT_SECRET } from '../config/jwt.config';

const decodeFakeToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const signToken = (id: string) => {
  const jwtOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };
  return jwt.sign({ id }, JWT_SECRET, jwtOptions);
};

export const isSignedIn: RequestHandler = async (req, _res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(new UnauthorizedError('You are not logged in! Please log in to get access.'));
    }
    // 2) Verification token
    const decoded: JwtPayloadI = jwt.verify(token, JWT_SECRET) as JwtPayloadI;
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new UnauthorizedError('The user belonging to this token does no longer exist.'));
    }
    // 4) Check if user changed password after the token was issued
    if (await currentUser.passwordRecentlyChanged(decoded.iat)) {
      return next(new UnauthorizedError('User recently changed password! Please log in again.'));
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

export const signup: RequestHandler = async (req, res, next) => {
  try {
    // Create user in database
    const newUser = await User.create(req.body);
    const user: newUserResponseDTO = {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      address: newUser.address,
      birthDate: newUser.birthDate,
    };

    // Generate activation token
    const token: string = await newUser.createSignUpToken();

    // Config and send mail to user with activation token
    await sendVerificationEmail(token, newUser.firstName, newUser.email);

    res.status(StatusCodes.CREATED).json({
      status: getReasonPhrase(StatusCodes.CREATED),
      data: {
        message: 'Activation email sent',
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const activateAccount: RequestHandler = async (req, res, next) => {
  try {
    // Hash the token to match the DB stored one
    const signupToken = decodeFakeToken(req.params.token);

    // Search for the user with valid existing and valid token
    const user = await User.findOne({ signupToken, signupTokenExpire: { $gt: Date.now() } });
    if (!user) {
      throw new UnauthorizedError('token invalid or expired');
    }
    if (user.active) {
      throw new UnauthorizedError('user already active');
    }

    await user.activateAccount();

    const token = signToken(user._id.toString());
    res.status(StatusCodes.OK).json({
      status: getReasonPhrase(StatusCodes.OK),
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

export const activateAccountRetry: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Generate activation token
    const token: string = await user.createSignUpToken();

    // Config and send mail to user with activation token
    const mailOptions: MailOptions = {
      email: user.email,
      message: `Hello ${user.firstName} this is your actvation link ${req.protocol}://${req.hostname}/api/v1/auth/signup/${token}`,
      subject: 'Activation retry',
    };
    await sendEmail(mailOptions);

    res.status(StatusCodes.OK).json({
      status: getReasonPhrase(StatusCodes.OK),
      data: {
        message: 'Activation email sent',
      },
    });
  } catch (err) {
    next(err);
  }
};

export const signin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthorizedError('email not found');
    }
    if (!user.active) {
      throw new UnauthorizedError('User is inactive');
    }
    if (!(await user.verifyPassword(password))) {
      throw new UnauthorizedError('incorrect password');
    }

    const token = signToken(user._id.toString());
    res.status(StatusCodes.OK).json({
      status: getReasonPhrase(StatusCodes.OK),
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

export const signout: RequestHandler = (_req, res, next) => {
  try {
    res.status(StatusCodes.NO_CONTENT).json({});
  } catch (err) {
    next(err);
  }
};

export const forgotPasswordRequest: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (!user.active) {
      throw new UnauthorizedError('User is inactive, please active first');
    }
    const token = await user.createPasswordResetToken();

    await sendPasswordRecoveryEmail(token, user.firstName, user.email);

    res.status(StatusCodes.OK).json({
      status: getReasonPhrase(StatusCodes.OK),
      data: {
        message: 'recovery email sent',
      },
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPasswordUpdate: RequestHandler = async (req, res, next) => {
  try {
    const passwordResetToken = decodeFakeToken(req.params.token);
    const { password } = req.body;
    const user = await User.findOne({ passwordResetToken, passwordResetTokenExpire: { $gt: Date.now() } });
    if (!user) {
      throw new UnauthorizedError('Token invalid or expired');
    }
    await user.updatePassword(password);

    const token = signToken(user._id.toString());
    res.status(StatusCodes.OK).json({
      status: getReasonPhrase(StatusCodes.OK),
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

export const PasswordUpdate: RequestHandler = async (req, res, next) => {
  try {
    const { currentPassword, password } = req.body;
    if (!req.user) {
      throw new Error('user not defined');
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error('User not found');
    }
    if (await user.verifyPassword(currentPassword)) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    await user.updatePassword(password);

    const token = signToken(user._id.toString());
    res.status(StatusCodes.OK).json({
      status: getReasonPhrase(StatusCodes.OK),
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};
