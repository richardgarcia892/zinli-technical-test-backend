export interface signupDTO {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  birthDate: Date;
  password: string;
  passwordConfirm: string;
}

export interface signinDTO {
  email: string;
  password: string;
}

export interface forgotPasswordRequestDTO {
  email: string;
}

export interface forgotPasswordUpdateDTO {
  password: string;
  passwordConfirm: string;
}

export interface PasswordUpdateDTO {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

export interface newUserResponseDTO {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  birthDate: Date;
}

export interface retryActivationDTO {
  email: string;
}
