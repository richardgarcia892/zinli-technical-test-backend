export interface getUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  birthDate: Date;
}

export interface updateUserDTO {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}
