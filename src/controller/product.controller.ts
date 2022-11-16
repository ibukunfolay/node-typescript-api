import { Request, Response } from 'express';
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
} from '../services/product.service';
import log from '../../utils/logger';
import {
  createProductInput,
  deleteProductInput,
  getProductInput,
  updateProductInput,
} from '../schema/product.schema';

export const createProductHandler = async (
  req: Request<{}, {}, createProductInput['body']>,
  res: Response,
) => {
  try {
    const userId = res.locals.user._id;

    const body = req.body;

    const product = await createProduct({ ...body, user: userId });
    return res.send(product);
  } catch (error: any) {
    log.error(error);
    return res.status(409).send(error.message);
  }
};

export const getProductHandler = async (
  req: Request<{}, {}, getProductInput['params']>,
  res: Response,
) => {
  try {
    const productId = req.params.productId;

    const product = await findProduct({ productId });

    if (!product) {
      return res.send(404);
    }

    return res.send(product);
  } catch (error: any) {
    log.error(error);
    return res.status(409).send(error.message);
  }
};

export const updateProductHandler = async (
  req: Request<{}, {}, updateProductInput['params']>,
  res: Response,
) => {
  try {
    const userId = res.locals.user._id;

    const update = req.body;

    const productId = req.params.productId;

    const product = await findProduct({ productId });

    console.log(product);

    if (!product) {
      return res.sendStatus(404);
    }

    const productCreator = product.user;

    if (productCreator.toString() !== userId) {
      return res.sendStatus(403).send({ productCreator });
    }

    const updateProduct = await findAndUpdateProduct({ productId }, update, {
      new: true,
    });
    return res.send(updateProduct);
  } catch (error: any) {
    log.error(error);
    return res.status(409).send(error.message);
  }
};

export const deleteProductHandler = async (
  req: Request<{}, {}, deleteProductInput['params']>,
  res: Response,
) => {
  try {
    const userId = res.locals.user._id;

    const productId = req.params.productId;

    const product = await findProduct({ productId });

    if (!product) {
      return res.sendStatus(404);
    }

    const productCreator = product.user;

    if (productCreator.toString()  !== userId) {
      return res.sendStatus(403).send(productCreator);
    }

    const deletedProduct = await deleteProduct({ productId });

    if (!deletedProduct) {
      return res.sendStatus(404);
    }

    return res.send(200);
  } catch (error: any) {
    log.error(error);
    return res.status(409).send(error.message);
  }
};
