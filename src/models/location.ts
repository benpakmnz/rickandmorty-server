import mongoose, { Model, Schema, Document } from "mongoose";

export interface ILocationAttrs {
  id: number;
  name: string;
  dimension: string;
  type: string;
  residents: string[];
}

interface ILocationModel extends Model<ILocationDocument> {
  build(attrs: ILocationAttrs): ILocationDocument;
}

export interface ILocationDocument extends Document {
  id: number;
  name: string;
  dimension: string;
  type: string;
  residents: string[];
}

const locationSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    dimension: {
      type: String,
      required: true,
    },
    type: { type: String, required: true },
    residents: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    toJSON: {
      transform(Document, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const LocationModel = mongoose.model<ILocationDocument, ILocationModel>(
  "Location",
  locationSchema
);

export { LocationModel };
