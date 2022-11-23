import { Express, Request, Response } from 'express';
import {
  createUserHandler,
  getCurrentUser,
} from './controller/user.controller';
import validate from './middleware/validateResource';
import { createUserSchema } from './schema/user.schema';
import { createSessionSchema } from './schema/session.schema';
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessionHandler,
} from './controller/session.controller';
import requireUser from './middleware/requireUser';
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from './schema/product.schema';
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from './controller/product.controller';

export default function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  //user routes
  app.get('/api/me', requireUser, getCurrentUser);
  app.post('/api/users', validate(createUserSchema), createUserHandler);

  app.post(
    '/api/sessions',
    validate(createSessionSchema),
    createSessionHandler,
  );

  app.get('/api/sessions', requireUser, getUserSessionHandler);
  app.delete('/api/sessions', requireUser, deleteSessionHandler);

  //product routes
  app.post(
    '/api/products',
    [requireUser, validate(createProductSchema)],
    createProductHandler,
  );
  app.get(
    '/api/products/:productId',
    validate(getProductSchema),
    getProductHandler,
  );
  app.put(
    '/api/products/:productId',
    [requireUser, validate(updateProductSchema)],
    updateProductHandler,
  );
  app.delete(
    '/api/products/:productId',
    [requireUser, validate(deleteProductSchema)],
    deleteProductHandler,
  );
}
