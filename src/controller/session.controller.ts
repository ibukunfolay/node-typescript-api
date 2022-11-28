import { CookieOptions, Request, Response } from 'express';
import {
  findAndUpdateUser,
  getGoogleOauthTokens,
  getGoogleUser,
  validatePassword,
} from '../services/user.service';
import {
  createSession,
  findSessions,
  updateSessions,
} from '../services/session.service';
import config from 'config';
import { signJwt } from '../utils/jwt.utils';
import log from '../utils/logger';

const accessTokenCookieOption: CookieOptions = {
  maxAge: 900000, // 15mins in milliseconds
  httpOnly: true,
  domain: 'localhost',
  path: '/',
  sameSite: 'lax',
  secure: false,
};

const refreshTokenCookieOption: CookieOptions = {
  ...accessTokenCookieOption,
  maxAge: 3.154e10, // 15mins in milliseconds
};

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

  res.cookie('accessToken', accessToken, accessTokenCookieOption);

  res.cookie('refreshToken', refreshToken, refreshTokenCookieOption);

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

export const getGoogleOauthHandler = async (req: Request, res: Response) => {
  try {
    //get the code from the query-string
    const code = req.query.code as string;

    // get the id and access token with the code
    const { id_token, access_token } = await getGoogleOauthTokens({ code });

    // get user details
    const googleUser = await getGoogleUser({ id_token, access_token });

    if (!googleUser.verified_email) {
      return res.status(403).send('Google account is not verified');
    }

    //upsert the user
    const user = await findAndUpdateUser(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      {
        upsert: true,
        new: true,
      },
    );

    //create session
    //@ts-ignore
    const session = await createSession(user._id, req.get('user-agent') || '');

    const accessToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get('accessTokenTtl') },
    );

    const refreshToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get('refreshTokenTtl') },
    );

    // set cookies
    res.cookie('accessToken', accessToken, accessTokenCookieOption);

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOption);

    // redirect back to client
    res.redirect(`${config.get('origin')}`);
  } catch (error) {
    log.error(error, 'failed to authorize user');
    return res.redirect(`${config.get('origin')}`);
  }
};
