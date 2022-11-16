import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import productModel, { ProductDocument } from '../models/product.model';

export async function createProduct(
  input: DocumentDefinition<
    Omit<ProductDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>
  >,
) {
  const product = await productModel.create(input);

  return product.toJSON<ProductDocument>();
}

export async function findProduct(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true },
) {
  return productModel.find(query, {}, options);
}

export async function findAndUpdateProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions,
) {
  return productModel.findOneAndUpdate({ query, update, options });
}

export async function deleteProduct(query: FilterQuery<ProductDocument>) {
  return await productModel.deleteOne(query);
}
