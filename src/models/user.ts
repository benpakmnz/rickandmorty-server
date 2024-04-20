import mongoose, { Model, Schema, Document } from "mongoose";

export interface UserAttrs {
  email: string;
  name: string;
  // requests: Schema.Types.ObjectId[];
  password: string;
  isAdmin: boolean;
  // user_pic: string;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends Document {
  email: string;
  name: string;
  // requests: Schema.Types.ObjectId[];
  password: string;
  isAdmin: boolean;
  // user_pic: string;
}

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    // requests: [{ type: Schema.Types.ObjectId, ref: "LocationReq" }],
    password: { type: String, required: true },
    isAdmin: { type: Boolean },
    // user_pic: { type: String },
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
