import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import createServer from '../utils/createServer';
import mongoose from 'mongoose';
import { createProduct } from '../services/product.service';
import { signJwt } from '../utils/jwt.utils';

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

export const userPayload = {
  _id: userId,
  email: 'jane.doe@example.com',
  name: 'Jane Doe',
};

export const productPayload = {
  user: userId,
  title: 'Canon EOS 1500D DSLR Camera with 18-55mm Lens',
  description:
    'Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.',
  price: 879.99,
  image: 'https://i.imgur.com/QlRphfQ.jpg',
};

describe('product', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('get product route', () => {
    describe('given the product does not exist', () => {
      it('should return a 404', async () => {
        const productId = 'pr-223';
        await supertest(app).get(`/api/products/${productId}`).expect(404);
      });
    });

    describe('given the product exists', () => {
      it('should return a 200 and product', async () => {
        const product = await createProduct(productPayload);

        const { statusCode, body } = await supertest(app).get(
          `/api/products/${product._id}`,
        );

        expect(statusCode).toBe(200);
        expect(body.title).toEqual(product.title);
      });
    });
  });

  describe('create product route', () => {
    describe('user is not logged in', () => {
      it('should return a status code 403', async () => {
        const { statusCode } = await supertest(app).post(`/api/products`);

        expect(statusCode).toBe(403);
      });
    });

    describe('user is logged in', () => {
      it('should return a status code 200 and product', async () => {
        const jwt = signJwt(userPayload);

        const { body, statusCode } = await supertest(app)
          .post(`/api/products`)
          .set('Authorization', `Bearer ${jwt}`)
          .send(productPayload);

        expect(statusCode).toBe(200);
        expect(body).toEqual({
          _id: expect.any(String),
          user: expect.any(String),
          title: 'Canon EOS 1500D DSLR Camera with 18-55mm Lens',
          description:
            'Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.',
          price: 879.99,
          image: 'https://i.imgur.com/QlRphfQ.jpg',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0,
        });
      });
    });
  });
});
