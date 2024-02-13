import * as yup from 'yup';

const REGEX = {
  username: /^[A-ZА-Я]/,
  password: /^(?=.*[^\p{L}\d\s])(?=.*\d)(?=.*\p{Lu})(?=.*\p{Ll}).{4,}$/u,
};

export const VALIDATION_MESSAGE = {
  firstName: 'YUP_FIRST_LETTER',
  lastName: 'YUP_FIRST_LETTER',
  email: {
    required: 'YUP_EMAIL_REQUIRED',
    valid: 'YUP_EMAIL_INVALID',
  },
  password: {
    length: 'YUP_PASS_LENGTH',
    required: 'YUP_PASSWORD_REQUIRED',
  },
};

const schema = yup
  .object({
    firstName: yup
      .string()
      .matches(REGEX.username, VALIDATION_MESSAGE.firstName)
      .required(),
    lastName: yup
      .string()
      .matches(REGEX.username, VALIDATION_MESSAGE.lastName)
      .required(),
    email: yup
      .string()
      .email(VALIDATION_MESSAGE.email.valid)
      .required(VALIDATION_MESSAGE.email.required),
    password: yup
      .string()
      .min(6, VALIDATION_MESSAGE.password.length)
      .required(VALIDATION_MESSAGE.password.required),
  })
  .required();

export type SchemaSignUp = yup.InferType<typeof schema>;

export default schema;
