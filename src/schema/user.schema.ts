import { Omit } from 'lodash';
import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email({ message: 'invalid email' }),
    password: string({
      required_error: 'Password is required',
    }).min(6, 'password must be more than six characters'),
    passwordConfirmation: string({
      required_error: 'Re-type password',
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['password confirmation'],
  }),
});

export type createUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirmation'
>;
