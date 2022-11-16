// import { customAlphabet } from 'nanoid';
import { Schema, model, Document } from 'mongoose';
import { UserDocument } from './user.model';

// const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

export interface ProductDocument extends Document {
  user: UserDocument['_id'];
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema(
  {
    // productId: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   default: () => `product_${nanoid()}`,
    // },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

const productModel = model<ProductDocument>('Product', productSchema);

export default productModel;
