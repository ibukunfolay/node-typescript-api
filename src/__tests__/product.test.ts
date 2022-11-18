import supertest from 'supertest';
import createServer from '../utils/createServer';

const app = createServer();

describe('product', () => {
  describe('get product route', () => {
    describe('given the product does not exist', () => {
      it('should return a 404', async () => {
        const productId = 'pr-223';
        await supertest(app).get(`/api/products/:${productId}`).expect(404);
      });
    });
  });
});
