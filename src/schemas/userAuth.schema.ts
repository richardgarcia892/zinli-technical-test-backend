import Joi from 'joi';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import schemaConfig from '../config/schemas.config';
import {
  signupDTO,
  signinDTO,
  forgotPasswordRequestDTO,
  forgotPasswordUpdateDTO,
  PasswordUpdateDTO,
  retryActivationDTO,
} from '../DTO/auth.dto';
import { updateUserDTO } from '../DTO/user.dto';

const email = Joi.string().email().min(schemaConfig.emailMinLength).max(schemaConfig.emailMaxLength);
const firstName = Joi.string().min(schemaConfig.nameMinLength).max(schemaConfig.nameMaxLength);
const lastName = Joi.string().min(schemaConfig.nameMinLength).max(schemaConfig.nameMaxLength);
const address = Joi.string().min(schemaConfig.addressMinLength).max(schemaConfig.addressMaxLength);
const password = Joi.string().min(schemaConfig.passwordMinLength).max(schemaConfig.PasswordmaxLength);

const phone = Joi.string()
  .min(8)
  .max(14)
  .external(async (value: string) => {
    const phoneNumber = parsePhoneNumberFromString(value, 'PA');
    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new Error(`invalid phone: ${value}`);
    }
    return value;
  });

const birthDate = Joi.string()
  .min(10)
  .max(10)
  .external((value: string) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(`Date ${value} is invalid`);
    }
    return date;
  })
  .custom((value) => {
    if (!(value instanceof Date)) return new Date(value);
    return value;
  }, 'date.parse');

export const signupSchema = Joi.object<signupDTO>({
  email: email.required(),
  firstName: firstName.required(),
  lastName: lastName.required(),
  phone: phone.required(),
  birthDate: birthDate.required(),
  address: address.required(),
  password: password.required().valid(Joi.ref('passwordConfirm')).messages({
    'any.only': 'passwords not equals',
  }),
  passwordConfirm: password.required(),
});

export const signinSchema = Joi.object<signinDTO>({
  email: email.required(),
  password: password.required(),
});

export const forgotPasswordRequestSchema = Joi.object<forgotPasswordRequestDTO>({
  email: email.required(),
});

export const forgotPasswordUpdateSchema = Joi.object<forgotPasswordUpdateDTO>({
  password: password.required().valid(Joi.ref('passwordConfirm')).messages({
    'any.only': 'Password and confirm password do not match',
  }),
  passwordConfirm: password.required(),
});

export const PasswordUpdateSchema = Joi.object<PasswordUpdateDTO>({
  currentPassword: password.required(),
  password: password.required().valid(Joi.ref('passwordConfirm')).messages({
    'any.only': 'Password and confirm password do not match',
  }),
  passwordConfirm: password.required(),
});

export const retryActivationSchema = Joi.object<retryActivationDTO>({
  email: email.required(),
});

export const updateUserProfileSchema = Joi.object<updateUserDTO>({
  firstName,
  lastName,
  phone,
  address,
});
