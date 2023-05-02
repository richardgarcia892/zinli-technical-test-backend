interface SchemaConfigInterface {
  emailMinLength: number;
  emailMaxLength: number;
  nameMinLength: number;
  nameMaxLength: number;
  addressMinLength: number;
  addressMaxLength: number;
  passwordMinLength: number;
  PasswordmaxLength: number;
}

const schemaConfig: SchemaConfigInterface = {
  emailMinLength: 3,
  emailMaxLength: 150,
  nameMinLength: 3,
  nameMaxLength: 100,
  addressMinLength: 3,
  addressMaxLength: 250,
  passwordMinLength: 4,
  PasswordmaxLength: 25,
};

export default schemaConfig;
