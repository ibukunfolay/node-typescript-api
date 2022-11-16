import { Omit } from 'lodash';
import { object, string, number, TypeOf } from 'zod';

const payload = {
  body: object({
    title: string({
      required_error: 'Title is required',
    }),
    description: string({
      required_error: 'Description is required',
    }).min(20, 'description should be atleast 20 characters'),
    price: number({
      required_error: 'Price is required',
    }),
    image: string({
      required_error: 'Image is required',
    }),
  }),
};

const params = {
  params: object({
    productId: string({
      required_error: 'productId is required',
    }),
  }),
};

export const createProductSchema = object({
  ...payload,
});

export const getProductSchema = object({
  ...params,
});

export const updateProductSchema = object({
  ...payload,
  ...params,
});

export const deleteProductSchema = object({
  ...params,
});

export type createProductInput = TypeOf<typeof createProductSchema>;
export type getProductInput = TypeOf<typeof getProductSchema>;
export type updateProductInput = TypeOf<typeof updateProductSchema>;
export type deleteProductInput = TypeOf<typeof deleteProductSchema>;
