import mongoose, { Model, Schema, Document } from "mongoose";

export interface UserAttrs {
  email: string;
  name: string;
  password: string;
  isAdmin: boolean;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends Document {
  email: string;
  name: string;
  password: string;
  isAdmin: boolean;
}

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
