import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  birthDate: Date;
  password: string;
  active: boolean;
  deleted: boolean;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetTokenExpire: Date;
  signupToken: string;
  signupTokenExpire: Date;
  createSignUpToken: () => Promise<string>;
  createPasswordResetToken: () => Promise<string>;
  verifyPassword: (password: string) => Promise<boolean>;
  passwordRecentlyChanged: (jwtSignDateTs: number) => Promise<boolean>;
  updatePassword: (password: string) => Promise<void>;
  activateAccount: () => Promise<void>;
}

const userSchema = new Schema<IUser>(
  {
    email: { unique: true, lowercase: true, type: String, required: [true, 'email is required'], immutable: true },
    firstName: { type: String, required: [true, 'firstName is required'] },
    lastName: { type: String, required: [true, 'last name is required'] },
    phone: { type: String, required: [true, 'phone number is required'] },
    address: { type: String, required: [true, 'address is required'] },
    birthDate: { type: Date, required: [true, 'birthDate is required'], immutable: true },
    password: { type: String, required: [true, 'password is required'] },
    active: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetTokenExpire: { type: Date },
    signupToken: { type: String },
    signupTokenExpire: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', async function (next) {
  // this middleware shoud be skipper is password is NOT modified or file is NEW
  if (!this.isModified('password') || this.isNew) next();
  this.passwordChangedAt = new Date(Date.now() - 1000); // password changed 1 sec ago
  next();
});

// Verify incomming password with saved password
userSchema.methods.verifyPassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Create a 'fake' password reset token
userSchema.methods.createPasswordResetToken = async function (): Promise<string> {
  // Create and save reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  // TODO: Set lifespan inside config file
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes lifespan
  await this.save();
  return resetToken;
};

// Create a 'fake' user signup token
userSchema.methods.createSignUpToken = async function (): Promise<string> {
  // Create and save reset token
  const signupToken = crypto.randomBytes(32).toString('hex');
  this.signupToken = crypto.createHash('sha256').update(signupToken).digest('hex');
  // TODO: Set lifespan inside config file
  this.signupTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes lifespan
  await this.save();
  return signupToken;
};

// Verify is passwordChangetAt is greater than TokenSignDate
userSchema.methods.passwordRecentlyChanged = async function (jwtSignDateTs: number): Promise<boolean> {
  if (!this.passwordChangedAt) return false;
  const PasswordChangeDateTS = this.passwordChangedAt.getTime() / 1000;
  return jwtSignDateTs < PasswordChangeDateTS;
};

userSchema.methods.updatePassword = async function (password: string): Promise<void> {
  this.password = password;
  this.passwordResetToken = undefined;
  this.passwordResetTokenExpire = undefined;
  this.save();
};

userSchema.methods.activateAccount = async function (): Promise<void> {
  this.active = true;
  this.signupToken = undefined;
  this.signupTokenExpire = undefined;
  this.save();
};

const User = model<IUser>('User', userSchema);

export default User;
