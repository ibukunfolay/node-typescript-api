import { omit } from 'lodash';
import { FilterQuery } from 'mongoose';
import userModel, { UserDocument, UserInput } from '../models/user.model';

export async function createUser(input: UserInput) {
  try {
    const user = await userModel.create(input);
    return omit(user.toJSON(), 'password');
  } catch (e: any) {
    throw new Error(e);
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
