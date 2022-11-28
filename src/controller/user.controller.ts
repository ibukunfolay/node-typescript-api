import { Request, Response } from 'express';
import logger from '../utils/logger';
import { createUser } from '../services/user.service';
import { createUserInput } from '../schema/user.schema';

export const createUserHandler = async (
  req: Request<{}, {}, createUserInput['body']>,
  res: Response,
) => {
  try {
    const user = await createUser(req.body);
    return res.send(user);
  } catch (error: any) {
    logger.error(error.message);
    return res.status(409).send(error.message);
  }
};

export const getCurrentUser = async (
  req: Request<{}, {}, createUserInput['body']>,
  res: Response,
) => {
  return res.send(res.locals.user);
};
