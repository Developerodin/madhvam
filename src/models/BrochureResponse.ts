import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const BrochureResponseSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

export type BrochureResponseDoc = InferSchemaType<typeof BrochureResponseSchema> & {
  _id: Schema.Types.ObjectId;
};

export const BrochureResponse: Model<BrochureResponseDoc> =
  models.BrochureResponse ||
  model<BrochureResponseDoc>("BrochureResponse", BrochureResponseSchema);
