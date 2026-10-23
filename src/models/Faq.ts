import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answerHtml: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type FaqDoc = InferSchemaType<typeof FaqSchema> & {
  _id: Schema.Types.ObjectId;
};

export const Faq: Model<FaqDoc> =
  models.Faq || model<FaqDoc>("Faq", FaqSchema);
