import bcrypt from 'bcrypt';
import config from 'config';
import { Schema, model, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

//bcrypt password hash presave

userSchema.pre('save', async function (next) {
  let user = this as UserDocument;

  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));

  const hashed = await bcrypt.hash(user.password, salt);

  user.password = hashed;

  return next();
});

//login password check

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const user = this as UserDocument;

  return await bcrypt
    .compare(candidatePassword, user.password)
    .catch((e) => false);
};

const userModel = model<UserDocument>('User', userSchema);

export default userModel;
