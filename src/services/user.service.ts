import { omit } from 'lodash';
import { FilterQuery } from 'mongoose';
import userModel, { UserDocument, UserInput } from '../models/user.model';

export async function createUser(input: UserInput) {
  const { email } = input;
  const existingUser = await userModel.findOne({ email });

  if (!existingUser) {
    const user = await userModel.create(input);
    return omit(user.toJSON(), 'password');
  } else {
    throw new Error('email already in use');
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await userModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), 'password');
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return await userModel.findOne(query).lean();
}
