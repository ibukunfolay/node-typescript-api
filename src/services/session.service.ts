import { get } from 'lodash';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { signJwt, verifyJwt } from '../utils/jwt.utils';
import sessionModel from '../models/session.model';
import { SessionDocument } from '../models/session.model';
import { findUser } from './user.service';
import config from 'config';

export async function createSession(userId: string, userAgent: string) {
  const session = await sessionModel.create({ user: userId, userAgent });

  return session.toJSON<SessionDocument>();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return sessionModel.find(query).lean();
}

export async function updateSessions(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>,
) {
  return sessionModel.updateOne({ query, update });
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, 'session')) return false;

  const session = await sessionModel.findById(get(decoded, 'session'));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get('refreshTokenTtl') },
  );

  return accessToken;
}
