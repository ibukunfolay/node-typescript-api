import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import productModel, {
  ProductDocument,
  ProductInput,
} from '../models/product.model';

export async function createProduct(input: ProductInput) {
  const product = await productModel.create(input);

  return product.toJSON();
}

export async function findProduct(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true },
) {
  return productModel.findOne(query, {}, options);
}

export async function findAndUpdateProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions,
) {
  return productModel.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(query: FilterQuery<ProductDocument>) {
  return await productModel.deleteOne(query);
}
