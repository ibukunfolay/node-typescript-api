import { omit } from 'lodash';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import qs from 'qs';
import axios from 'axios';
import userModel, { UserDocument, UserInput } from '../models/user.model';
import config from 'config';
import logger from '../utils/logger';

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

interface GoogleTokensResult {
  refresh_token: string;
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
}

export async function getGoogleOauthTokens({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> {
  const url = 'https://oauth2.googleapis.com/token';

  const values = {
    code,
    client_id: config.get('googleClientId'),
    client_secret: config.get('googleClientSecret'),
    redirect_uri: config.get('googleRedirectUrl'),
    grant_type: 'aurhorization_code',
  };

  try {
    const res = await axios.post<GoogleTokensResult>(
      url,
      qs.stringify(values),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return res.data;
  } catch (error: any) {
    throw new Error(`google error: ${error.message}`);
  }
}

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function getGoogleUser({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<GoogleUserResult> {
  try {
    const res = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      },
    );

    return res.data;
  } catch (error: any) {
    logger.error(error, 'failed to fetch google user');
    throw new Error(error.message);
  }
}

export async function findAndUpdateUser(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions = {},
) {
  return await userModel.findOneAndUpdate(query, update, options);
}
