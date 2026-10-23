import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const PageSectionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    title: String,
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

export type PageSectionDoc = InferSchemaType<typeof PageSectionSchema> & {
  _id: Schema.Types.ObjectId;
};

export const PageSection: Model<PageSectionDoc> =
  models.PageSection ||
  model<PageSectionDoc>("PageSection", PageSectionSchema);
