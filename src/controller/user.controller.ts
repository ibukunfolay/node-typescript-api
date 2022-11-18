import { Request, Response } from 'express';
import log from '../utils/logger';
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
    log.error(error);
    return res.status(409).send(error.message);
  }
};
