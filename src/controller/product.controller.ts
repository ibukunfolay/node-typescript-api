import { Request, Response } from 'express';
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
} from '../services/product.service';
import logger from '../utils/logger';
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
    const userId = await res.locals.user._id;

    const body = req.body;

    const product = await createProduct({ ...body, user: userId });

    if (!product) {
      logger.error('error');
    }

    return res.send(product);
  } catch (error: any) {
    res.sendStatus(409).send(error);
  }
};

export const getProductHandler = async (
  req: Request<{}, {}, getProductInput['params']>,
  res: Response,
) => {
  try {
    const productId = req.params;

    const product = await findProduct({ productId });

    if (!product) {
      return res.send(404);
    }

    return res.send(product);
  } catch (error: any) {
    logger.error(error);
    return res.sendStatus(409).send(error.message);
  }
};

export const updateProductHandler = async (
  req: Request<updateProductInput['params']>,
  res: Response,
) => {
  try {
    const userId = res.locals.user._id;

    const update = req.body;

    const productId = req.params.productId;

    const product = await findProduct({ productId });

    if (!product) {
      return res.sendStatus(404);
    }

    const { user } = product;

    if (String(user) !== userId) {
      return res.sendStatus(403).send(user);
    }

    const updateProduct = await findAndUpdateProduct({ productId }, update, {
      new: true,
    });
    return res.send(updateProduct);
  } catch (error: any) {
    logger.error(error);
    return res.sendStatus(409).send(error.message);
  }
};

export const deleteProductHandler = async (
  req: Request<deleteProductInput['params']>,
  res: Response,
) => {
  try {
    const userId = res.locals.user._id;

    const productId = req.params.productId;

    const product = await findProduct({ productId });

    if (!product) {
      return res.sendStatus(404);
    }

    const { user } = product;

    if (String(user) !== userId) {
      return res.sendStatus(403).send(user);
    }

    const deletedProduct = await deleteProduct({ productId });

    if (!deletedProduct) {
      return res.sendStatus(404);
    }

    return res.send(200);
  } catch (error: any) {
    logger.error(error);
    return res.sendStatus(409).send(error.message);
  }
};
