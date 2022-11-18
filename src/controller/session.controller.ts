import { Request, Response } from 'express';
import { validatePassword } from '../services/user.service';
import {
  createSession,
  findSessions,
  updateSessions,
} from '../services/session.service';
import config from 'config';
import { signJwt } from '../utils/jwt.utils';
import log from '../utils/logger';

export async function createSessionHandler(req: Request, res: Response) {
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send('invalid credentials');
  }

  const session = await createSession(user._id, req.get('user-agent') || '');

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get('accessTokenTtl') },
  );

  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get('refreshTokenTtl') },
  );

  return res.send({
    accessToken,
    refreshToken,
  });
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSessions({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}

export const getUserSessionHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;

  // console.log(userId)

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
};
