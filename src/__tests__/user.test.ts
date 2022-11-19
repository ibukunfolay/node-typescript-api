import mongoose from 'mongoose';
import supertest from 'supertest';

import createServer from '../utils/createServer';
import * as UserService from '../services/user.service';
import * as SessionService from '../services/session.service';
import { createSessionHandler } from '../controller/session.controller';

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  email: 'jane.doe@example.com',
  name: 'Jane Doe',
};

const userInput = {
  email: 'jane.doe@example.com',
  name: 'Jane Doe',
  password: 'Password123',
  passwordConfirmation: 'Password123',
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: 'Postman',
  createdAt: new Date('2022-11-15'),
  updatedAt: new Date('2022-11-15'),
  __v: 0,
};

describe('user registration', () => {
  describe('given username and password are valid', () => {
    it('should return 200 status and user payload', async () => {
      const createUserserviceMock = jest
        .spyOn(UserService, 'createUser')
        // @ts-ignore
        .mockReturnValueOnce(userPayload);

      const { body, statusCode } = await supertest(app)
        .post('/api/users')
        .send(userInput);

      expect(statusCode).toBe(200);
      expect(body).toEqual(userPayload);
      expect(createUserserviceMock).toHaveBeenCalledWith(userInput);
    });
  });

  describe('given password do not match', () => {
    it('should return 400 status ', async () => {
      const createUserserviceMock = jest
        .spyOn(UserService, 'createUser')
        // @ts-ignore
        .mockReturnValueOnce(userPayload);

      const { statusCode } = await supertest(app)
        .post('/api/users')
        .send({ ...userInput, passwordConfirmation: 'Password1234' });

      expect(statusCode).toBe(400);
      expect(createUserserviceMock).not.toHaveBeenCalled();
    });
  });

  describe('given user service throws', () => {
    it('should return 409 status ', async () => {
      const createUserserviceMock = jest
        .spyOn(UserService, 'createUser')
        // @ts-ignore
        .mockRejectedValue('Error spotted');

      const { statusCode } = await supertest(app)
        .post('/api/users')
        .send(userInput);

      expect(statusCode).toBe(409);
      expect(createUserserviceMock).toHaveBeenCalled();
    });
  });
});

describe('create user session', () => {
  describe('given username and password are valid', () => {
    it('should return access token and refresh token', async () => {
      jest
        .spyOn(UserService, 'validatePassword')
        // @ts-ignore
        .mockReturnValueOnce(userPayload);

      jest
        .spyOn(SessionService, 'createSession')
        // @ts-ignore
        .mockReturnValueOnce(sessionPayload);

      const req = {
        get: () => {
          return 'user-agent';
        },
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const send = jest.fn();

      const res = {
        send,
      };

      // @ts-ignore
      await createSessionHandler(req, res);

      expect(send).toHaveBeenCalledWith({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });
});
