import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const DocumentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    tabLabel: { type: String, required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    meta: [
      {
        label: String,
        value: String,
        href: String,
      },
    ],
    noteHtml: String,
    actionLabel: String,
    actionHref: String,
    actionPending: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type DocumentDoc = InferSchemaType<typeof DocumentSchema> & {
  _id: Schema.Types.ObjectId;
};

export const DocumentItem: Model<DocumentDoc> =
  models.DocumentItem ||
  model<DocumentDoc>("DocumentItem", DocumentSchema);
