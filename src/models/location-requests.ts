import mongoose, { Model, Schema, Document } from "mongoose";

export interface ILocationReqAttrs {
  location: string;
  // user: Schema.Types.ObjectId;
}

interface ILocationReqModel extends Model<ILocationReqDoc> {
  build(attrs: ILocationReqAttrs): ILocationReqDoc;
}

export interface ILocationReqDoc extends Document {
  location: string;
  // user: Schema.Types.ObjectId;
}

const locationReqSchema = new Schema(
  {
    location: { type: String, required: true },
    // user: { type: String, ref: "User", required: true },
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

locationReqSchema.statics.build = (attrs: ILocationReqAttrs) => {
  return new LocationReqModel(attrs);
};

const LocationReqModel = mongoose.model<ILocationReqDoc, ILocationReqModel>(
  "LocationReq",
  locationReqSchema
);

export { LocationReqModel };
