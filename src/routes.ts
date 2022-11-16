import { Express, Request, Response } from 'express';
import { createUserHandler } from './controller/user.controller';
import validate from './middleware/validateResource';
import { createUserSchema } from './schema/user.schema';
import { createSessionSchema } from './schema/session.schema';
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessionHandler,
} from './controller/session.controller';
import requireUser from './middleware/requireUser';

export default function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post('/api/users', validate(createUserSchema), createUserHandler);

  app.post(
    '/api/sessions',
    validate(createSessionSchema),
    createSessionHandler,
  );

  app.get('/api/sessions', requireUser, getUserSessionHandler);
  app.delete('/api/sessions', requireUser, deleteSessionHandler);
}
